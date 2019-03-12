const express = require('express');
const bodyParser = require('body-parser');
const c = require('./content');
const fetch = require('r2');
const db = require('@asl/schema');

module.exports = settings => {
  const app = express();
  app.use(bodyParser.json());

  const { Profile } = db(settings.db);

  const getProfile = (id) => {
    return Profile.query()
      .where({ id: id })
      .eager('establishments')
      .then(profiles => profiles[0]);
  };

  const service = {

    whitelist(json) {

      let recipients = [];
      let applicantId = json.data.subject ? json.data.subject : json.data.data.licenceHolderId;

      switch (json.meta.next) {
        case 'autoresolved':
        case 'with-licensing':
        case 'referred-to-inspector':
        case 'inspector-recommended':
        case 'inspector-rejected':
        case 'resolved':
        case 'rejected':
        case 'returned-to-applicant':
        case 'with-ntco':
        case 'withdrawn-by-applicant': {
          return Promise.resolve()
            .then(() => getProfile(applicantId))
            .then(profile => {
              recipients.push({
                name: `${profile.firstName} ${
                  profile.lastName
                }`,
                email: profile.email,
                template: 'notification_task_change',
                identifierValue: `${profile.firstName} ${
                  profile.lastName
                }`
              });

              return recipients;
            });
        }
        default: {
          // send to no one
          return Promise.resolve(recipients);
        }

      }

    },
    notify(settings, json, to) {
      const content = c[json.data.model];
      return Promise.resolve().then(
        fetch(`${settings.emailer.host}/${to.template}`, {
          method: 'POST',
          json: {
            taskType: content.taskType,
            name: to.name,
            to: to.email,
            identifier: content.identifier,
            identifierValue: to.identifierValue,
            prevStatus: content[json.meta.previous],
            newStatus: content[json.meta.next],
            url: '<url>',
            subject: `Status change ${content.taskType}`
          }
        })
      );
    }
  };

  app.post('/notify', (req, res, next) => {
    const json = req.body;

    if (json.data.action === 'create' || json.data.action === 'grant') {
      service.whitelist(json).then(list => {
        list.map(to => {
          service.notify(settings, json, to);
        });
      });
    }
  });

  return app;
};
