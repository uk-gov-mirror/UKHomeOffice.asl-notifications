const { get } = require('lodash');
const taskHelper = require('../utils/task');

module.exports = ({ schema, logger, task }) => {
  logger.verbose('generating notifications for project task');

  const notifications = new Map();
  const { Profile } = schema;
  const applicantId = get(task, 'data.subject');
  const establishmentId = get(task, 'data.establishmentId');
  const action = get(task, 'data.action');
  const ignoredActions = ['create', 'delete', 'delete-amendments', 'fork'];

  const getAdmins = establishmentId => Profile.query()
    .scopeToEstablishment('establishments.id', establishmentId, 'admin');

  if (ignoredActions.includes(action)) {
    logger.verbose(`ignoring task: project ${action}`);
    return Promise.resolve(new Map());
  }

  return Profile.query().findById(applicantId)
    .then(applicant => {
      logger.debug(`applicant is ${applicant.firstName} ${applicant.lastName}`);

      if (taskHelper.isNew(task)) {
        logger.verbose('task is new, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-opened', applicant, recipient: applicant });

      } else if (taskHelper.isWithApplicant(task)) {
        logger.verbose('task is with applicant, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-action-required', applicant, recipient: applicant });

      } else if (taskHelper.isOverTheFence(task)) {
        logger.verbose('task is over the fence, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-with-asru', applicant, recipient: applicant });

      } else if (taskHelper.isClosed(task)) {
        logger.verbose('task is closed, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-closed', applicant, recipient: applicant });
      }

      if (taskHelper.isWithEstablishmentAdmin(task) || taskHelper.isNew(task) || taskHelper.isClosed(task)) {
        return getAdmins(establishmentId)
          .then(admins => {
            admins.map(profile => {
              if (taskHelper.isWithEstablishmentAdmin(task)) {
                logger.verbose('task is with admin, notifying admin');
                notifications.set(profile.id, { emailTemplate: 'task-action-required', applicant, recipient: profile });

              } else if (taskHelper.isNew(task)) {
                logger.verbose('task is new, notifying admin');
                notifications.set(profile.id, { emailTemplate: 'task-opened', applicant, recipient: profile });

              } else if (taskHelper.isClosed(task)) {
                logger.verbose('task is closed, notifying admin');
                notifications.set(profile.id, { emailTemplate: 'task-closed', applicant, recipient: profile });
              }
            });
          });
      }
    })
    .then(() => notifications);
};
