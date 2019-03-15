const fetch = require('r2');
const { uniq, get, flatten, reduce } = require('lodash');
const api = require('@asl/service/api');
const db = require('@asl/schema');
const { NotFoundError, BadRequestError } = require('./errors');
const content = require('./content');

module.exports = settings => {
  const app = api(settings);

  const { Profile, Role, PIL, Project, Establishment } = db(settings.db);

  const getType = (req, model) => {
    if (model === 'pil' || model === 'ppl') {
      const Model = model === 'pil' ? PIL : Project;
      return Promise.resolve()
        .then(() => Model.query().findById(req.data.id))
        .then(licence => licence.status === 'active' ? 'amendment' : 'application');
    }
    return Promise.resolve('amendment');
  };

  const getIdentifier = (req, model) => {
    switch (model) {
      case 'pil':
        return Profile.query().findById(req.data.subject)
          .then(profile => `${profile.firstName} ${profile.lastName}`);
      case 'pel':
        return Establishment.query().findById(req.data.data.establishmentId)
          .then(establishment => establishment.name);
      case 'ppl':
        return Project.query().findById(req.data.id)
          .then(project => project.title);
    }
    return Promise.resolve();
  };

  const sendEmail = (req, { profile, subject, template }) => {
    let model = req.data.model;
    if (model === 'place' || model === 'role') {
      model = 'pel';
    }
    if (model === 'project') {
      model = 'ppl';
    }
    return getType(req, model)
      .then(type => {
        return getIdentifier(req, model)
          .then(identifierValue => {
            const taskType = content.type[model][type];
            return req.emailer(`/${template}`, {
              method: 'POST',
              json: {
                taskType,
                identifierValue,
                subject: `${subject}: ${taskType}`,
                to: profile.email,
                name: `${profile.firstName} ${profile.lastName}`,
                identifier: content.identifier[model][type],
                prevStatus: content.status[req.meta.previous],
                newStatus: content.status[req.meta.next],
                url: `${settings.publicUrl}/tasks/${req.taskId}`
              }
            });
          });
      });
  };

  const getProfiles = (req, type) => {
    switch (type) {
      case 'applicant':
        return getApplicants(req);
      case 'ntco':
        return getNTCOS(req);
    }
    return Promise.resolve();
  };

  const lookup = (req, type) => {
    const state = req.meta.next;
    return Promise.all(
      reduce(settings.notifications, (arr, config, user) => {
        return config[type] && config[type].includes(state) ? [ ...arr, user ] : arr;
      }, []).map(type => getProfiles(req, type))
    )
      .then(profiles => flatten(profiles));
  };

  app.use((req, res, next) => {
    req.emailer = (path, params) => fetch(`${settings.emailer}${path}`, params);
    next();
  });

  const getApplicants = req => {
    return Promise.resolve()
      .then(() => {
        const applicants = uniq([req.data.subject, req.data.changedBy].filter(Boolean));

        if (!applicants.length) {
          throw new NotFoundError();
        }
        return applicants;
      })
      .then(applicants => Profile.query().findByIds(applicants))
      .then(profiles => {
        if (!profiles.length) {
          throw new NotFoundError();
        }
        return profiles;
      });
  };

  const getNTCOS = req => {
    return Promise.resolve()
      .then(() => {
        const establishmentId = get(req.data, 'data.establishmentId');
        if (!establishmentId) {
          throw new NotFoundError();
        }
        return establishmentId;
      })
      .then(establishmentId => {
        return Role.query()
          .select('profileId')
          .where({ establishmentId, type: 'ntco' });
      })
      .then(roles => {
        if (!roles) {
          throw new NotFoundError();
        }
        return Profile.query()
          .findByIds(roles.map(role => role.profileId));
      })
      .then(ntcos => {
        if (!ntcos.length) {
          throw new NotFoundError();
        }
        return ntcos;
      });
  };

  const getData = (req, res, next) => {
    const { data, meta, id } = req.body;

    if (!data || !meta || !id) {
      return next(new BadRequestError());
    }

    Object.assign(req, { data, meta, taskId: id });

    next();
  };

  const getRecipients = (req, res, next) => {
    Promise.all([
      lookup(req, 'action'),
      lookup(req, 'status')
    ])
      .then(([ action, status ]) => {
        req.recipients = { action, status };
      })
      .then(() => next())
      .catch(next);
  };

  const notify = (req, res, next) => {
    const notifications = flatten([
      ...req.recipients.action.map(profile => ({
        profile,
        subject: 'Action required',
        template: 'notification-task-action'
      })),
      ...req.recipients.status.map(profile => ({
        profile,
        subject: 'Status change',
        template: 'notification-task-change'
      }))
    ]);

    Promise.all(notifications.map(notification => sendEmail(req, notification)))
      .then(() => next())
      .catch(next);
  };

  app.post('/',
    getData,
    getRecipients,
    notify
  );

  return app;
};
