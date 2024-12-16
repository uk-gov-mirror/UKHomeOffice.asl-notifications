const { get } = require('lodash');
const taskHelper = require('../utils/task');

module.exports = ({ schema, logger, task }) => {
  logger.verbose('generating notifications for profile task');

  const notifications = new Map();
  const { Profile } = schema;
  const applicantId = get(task, 'data.subject');
  const action = get(task, 'data.action');

  const allowedActions = ['update'];

  if (!allowedActions.includes(action)) {
    logger.verbose(`ignoring task: profile ${action}`);
    return Promise.resolve(new Map());
  }

  return Profile.query().findById(applicantId).withGraphFetched('[establishments]')
    .then(applicant => {
      logger.debug(`applicant is ${applicant.firstName} ${applicant.lastName}`);

      if (taskHelper.isAutoresolved(task)) {
        return;
      }

      if (taskHelper.isWithApplicant(task)) {
        logger.verbose('task is with applicant, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-action-required', applicant, recipient: applicant });

      } else if (taskHelper.isOverTheFence(task)) {
        logger.verbose('task is over the fence, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-with-asru', applicant, recipient: applicant });

      } else if (taskHelper.isClosed(task)) {
        logger.verbose('task is closed, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-closed', applicant, recipient: applicant });
      }

    })
    .then(() => notifications);
};
