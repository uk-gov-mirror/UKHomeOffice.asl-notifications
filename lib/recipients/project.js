const { get } = require('lodash');
const moment = require('moment');
const taskHelper = require('../utils/task');
const { subscribedFilter } = require('../utils/is-subscribed');

module.exports = async ({ schema, logger, task }) => {
  logger.verbose('generating notifications for project task');

  const notifications = new Map();
  const { Profile, Project, ProjectEstablishment } = schema;
  const applicantId = get(task, 'data.subject');
  const action = get(task, 'data.action');
  const projectId = get(task, 'data.id');
  const allowedActions = [
    'grant',
    'update',
    'transfer',
    'revoke',
    'project-expiring-12',
    'project-expiring-6',
    'project-expiring-3',
    'project-expired'
  ];

  const dateFormat = 'D MMM YYYY';

  const getAdmins = establishmentId => Profile.query()
    .withGraphFetched('emailPreferences')
    .scopeToEstablishment('establishments.id', establishmentId, 'admin');

  if (!allowedActions.includes(action)) {
    logger.verbose(`ignoring task: project ${action}`);
    return Promise.resolve(new Map());
  }

  const project = await Project.query().findById(projectId).withGraphFetched('licenceHolder');
  const establishmentId = get(task, 'data.establishmentId') || project.establishmentId;
  const applicant = applicantId && await Profile.query().findById(applicantId);

  const raDate = project.raDate && moment(project.raDate).format(dateFormat);
  const revocationDate = project.revocationDate && moment(project.revocationDate).format(dateFormat);
  const ropsDate = project.revocationDate && moment(project.revocationDate).add(28, 'days').format(dateFormat);
  const expiryDate = project.expiryDate && moment(project.expiryDate).format(dateFormat);

  if (applicant) {
    logger.debug(`applicant is ${applicant.firstName} ${applicant.lastName}`);
  }

  async function notifyAAAdmins({ message, emailTemplate, subject, ...params }) {
    const additionalEstablishments = await ProjectEstablishment.query().where({ projectId, status: 'active' });

    if (additionalEstablishments.length) {
      additionalEstablishments.reduce((promise, pe) => {
        return promise
          .then(() => getAdmins(pe.establishmentId))
          .then(admins => admins.filter(subscribedFilter({ establishmentId: pe.establishmentId, licenceType: 'ppl' })))
          .then(admins => {
            logger.verbose(`${message}, notifying additional availability admins`);
            admins.map(profile => {
              notifications.set(profile.id, { emailTemplate, applicant: subject, recipient: profile, establishmentId: pe.establishmentId, ...params });
            });
          });
      }, Promise.resolve());
    }
  }

  if (taskHelper.isExpired(task)) {
    logger.verbose('project has expired, notifying licence holder');
    notifications.set(project.licenceHolder.id, {
      emailTemplate: 'project-expired',
      addTaskTypeToSubject: false,
      recipient: project.licenceHolder,
      identifier: `${project.id}-${action}`,
      expiryDate,
      ropsDate
    });

    await notifyAAAdmins({ message: 'Licence expired', emailTemplate: 'project-expired', subject: project.licenceHolder, expiryDate, ropsDate });

  } else if (taskHelper.isExpiryNotice(task)) {
    const months = task.data.months;
    logger.verbose(`Project expiring in ${months} months, notifying licence holder`);
    notifications.set(project.licenceHolder.id, {
      emailTemplate: 'project-expiring',
      addTaskTypeToSubject: false,
      recipient: project.licenceHolder,
      identifier: `${project.id}-${action}`,
      months,
      expiryDate,
      ropsDate
    });

    await notifyAAAdmins({ message: `Licence expiring in ${months} months`, emailTemplate: 'project-expiring', subject: project.licenceHolder, months, expiryDate, ropsDate });

  } else if (taskHelper.isNew(task)) {
    logger.verbose('task is new, notifying applicant');
    notifications.set(applicantId, { emailTemplate: 'task-opened', applicant, recipient: applicant });

  } else if (taskHelper.isWithApplicant(task)) {
    logger.verbose('task is with applicant, notifying applicant');
    notifications.set(applicantId, { emailTemplate: 'task-action-required', applicant, recipient: applicant });

  } else if (taskHelper.isOverTheFence(task)) {
    logger.verbose('task is over the fence, notifying applicant');
    notifications.set(applicantId, { emailTemplate: 'task-with-asru', applicant, recipient: applicant });

  } else if (taskHelper.isGranted(task)) {
    logger.verbose('licence is granted, notifying applicant');
    notifications.set(applicantId, { emailTemplate: 'licence-granted', applicant, recipient: applicant });

    await notifyAAAdmins({ message: 'Licence granted', emailTemplate: 'licence-granted', subject: applicant });

    if (action === 'update') {
      const licenceHolderId = get(task, 'data.data.licenceHolderId');

      if (licenceHolderId !== applicantId) {
        logger.verbose('Licence holder updated, notifying new licence holder');
        const licenceHolder = await Profile.query().findById(licenceHolderId);
        notifications.set(licenceHolderId, { emailTemplate: 'licence-granted', recipient: licenceHolder });
      }
    }

  } else if (taskHelper.isClosed(task)) {
    if (action === 'revoke') {
      logger.verbose('project licence revoked, notifying applicant');
      notifications.set(applicantId, {
        emailTemplate: 'ppl-revoked',
        applicant,
        recipient: applicant,
        subject: 'Important: project licence has been revoked - action required',
        raDate,
        revocationDate,
        ropsDate
      });
    } else {
      logger.verbose('task is closed, notifying applicant');
      notifications.set(applicantId, { emailTemplate: 'task-closed', applicant, recipient: applicant });
    }

  }

  if (
    taskHelper.isExpired(task) ||
    taskHelper.isExpiryNotice(task) ||
    taskHelper.isWithEstablishmentAdmin(task) ||
    taskHelper.isNew(task) ||
    taskHelper.isClosed(task) ||
    taskHelper.isWithApplicant(task)
  ) {
    const admins = await getAdmins(establishmentId);

    admins
      .filter(subscribedFilter({ establishmentId, licenceType: 'ppl' }))
      .map(profile => {
        if (taskHelper.isExpired(task)) {
          logger.verbose('project has expired, notifying admin');
          notifications.set(profile.id, {
            emailTemplate: 'project-expired',
            addTaskTypeToSubject: false,
            identifier: `${project.id}-${action}`,
            recipient: profile,
            expiryDate,
            ropsDate
          });

        } else if (taskHelper.isExpiryNotice(task)) {
          const months = task.data.months;
          logger.verbose(`Project expiring in ${months} months, notifying admin`);
          notifications.set(profile.id, {
            emailTemplate: 'project-expiring',
            addTaskTypeToSubject: false,
            identifier: `${project.id}-${action}`,
            recipient: profile,
            months,
            expiryDate,
            ropsDate
          });

        } else if (taskHelper.isWithApplicant(task)) {
          logger.verbose('task is with applicant, notifying admin');
          notifications.set(profile.id, { emailTemplate: 'task-action-required', applicant, recipient: profile });

        } else if (taskHelper.isWithEstablishmentAdmin(task)) {
          logger.verbose('task is with admin, notifying admin');
          notifications.set(profile.id, { emailTemplate: 'task-action-required', applicant, recipient: profile });

        } else if (taskHelper.isNew(task)) {
          logger.verbose('task is new, notifying admin');
          notifications.set(profile.id, { emailTemplate: 'task-opened', applicant, recipient: profile });

        } else if (taskHelper.isGranted(task)) {
          logger.verbose('licence is granted, notifying admin');
          notifications.set(profile.id, { emailTemplate: 'licence-granted', applicant, recipient: profile });

        } else if (taskHelper.isClosed(task)) {
          if (action === 'revoke') {
            logger.verbose('project licence revoked, notifying admin');
            notifications.set(profile.id, {
              emailTemplate: 'ppl-revoked',
              applicant,
              recipient: profile,
              subject: 'Important: project licence has been revoked - action required',
              raDate,
              revocationDate,
              ropsDate
            });
          } else {
            logger.verbose('task is closed, notifying admin');
            notifications.set(profile.id, { emailTemplate: 'task-closed', applicant, recipient: profile });
          }
        }
      });
  }

  return notifications;
};
