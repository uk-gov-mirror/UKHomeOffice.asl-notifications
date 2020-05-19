const { get } = require('lodash');
const taskHelper = require('../utils/task');

module.exports = ({ schema, logger, task }) => {
  logger.verbose('generating notifications for establishment task');

  const notifications = new Map();
  const { Profile } = schema;
  const applicantId = get(task, 'data.changedBy');
  const establishmentId = get(task, 'data.establishmentId') || get(task, 'data.modelData.id');
  const action = get(task, 'data.action');
  const model = get(task, 'data.model');
  const ignoredActions = {
    establishment: ['create', 'update-billing'],
    place: [],
    role: []
  };

  const getAdmins = establishmentId => Profile.query()
    .scopeToEstablishment('establishments.id', establishmentId, 'admin');

  if (ignoredActions[model].includes(action)) {
    logger.verbose(`ignoring task: ${model} ${action}`);
    return Promise.resolve(new Map());
  }

  return Profile.query().findById(applicantId)
    .then(applicant => {
      logger.debug(`applicant is ${applicant.firstName} ${applicant.lastName}`);

      if (taskHelper.isWithApplicant(task)) {
        logger.verbose('task is with applicant, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-action-required', applicant, recipient: applicant });

      } else if (taskHelper.isOverTheFence(task)) {
        logger.verbose('task is over the fence, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-with-asru', applicant, recipient: applicant });

      } else if (taskHelper.isGranted(task)) {
        logger.verbose('licence granted, notifying applicant');
        const template = ['place', 'role'].includes(model) ? 'licence-amended' : 'licence-granted';
        notifications.set(applicantId, { emailTemplate: template, applicant, recipient: applicant });

      } else if (taskHelper.isClosed(task)) {
        logger.verbose('task is closed, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-closed', applicant, recipient: applicant });
      }

      if (task.status === 'returned-to-applicant' || taskHelper.isOverTheFence(task) || taskHelper.isClosed(task)) {
        return getAdmins(establishmentId)
          .then(admins => {
            admins.map(profile => {
              if (!notifications.has(profile.id)) {
                if (task.status === 'returned-to-applicant') {
                  logger.verbose('task is with admin, notifying admin');
                  notifications.set(profile.id, { emailTemplate: 'task-action-required', applicant, recipient: profile });

                } else if (taskHelper.isOverTheFence(task)) {
                  logger.verbose('task is over the fence, notifying admin');
                  notifications.set(profile.id, { emailTemplate: 'task-with-asru', applicant, recipient: profile });

                } else if (taskHelper.isGranted(task)) {
                  logger.verbose('licence granted, notifying admin');
                  const template = ['place', 'role'].includes(model) ? 'licence-amended' : 'licence-granted';
                  notifications.set(profile.id, { emailTemplate: template, applicant, recipient: profile });

                } else if (taskHelper.isClosed(task)) {
                  logger.verbose('task is closed, notifying admin');
                  notifications.set(profile.id, { emailTemplate: 'task-closed', applicant, recipient: profile });
                }
              }
            });
          });
      }
    })
    .then(() => notifications);
};
