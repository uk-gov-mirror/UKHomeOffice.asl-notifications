const { get } = require('lodash');
const content = require('./content');
const loadTemplate = require('./load-template');
const getLicenceType = require('./get-licence-type');
const getTaskType = require('./get-task-type');
const getIdentifier = require('./get-identifier');
const getLicencePath = require('./get-licence-path');
const getModel = require('./get-model');

// todo: add content for new email types and remove mapping to old emails
const oldTemplateMap = {
  'task-opened': 'task-change',
  'task-closed': 'task-change',
  'task-with-asru': 'task-change',
  'profile-updated': 'task-change',
  'task-action-required': 'task-action'
};

module.exports = ({ schema, emailer, logger, publicUrl }) => async ({ task, notifications }) => {
  const licenceType = getLicenceType(task);
  const taskType = getTaskType(task);
  const licencePath = getLicencePath(task);
  const model = await getModel({ schema, licenceType, task, logger });

  return Promise.all(Array.from(notifications).map(([id, notification]) => {
    logger.debug(`sending ${notification.emailTemplate} to ${notification.recipient.email}`);

    const applicant = notification.applicant;
    const recipient = notification.recipient;
    const templateName = oldTemplateMap[notification.emailTemplate] || notification.emailTemplate;
    const subject = notification.subject || `${content.subject[templateName]}: ${content.type[licenceType][taskType]}`;
    const recipientName = `${recipient.firstName} ${recipient.lastName}`;

    const templateVars = {
      licenceType: get(content, `licenceType[${licenceType}]`),
      grantType: get(content, `grantType[${taskType}]`),
      taskType: get(content, `type[${licenceType}][${taskType}]`),
      identifier: get(content, `identifier[${licenceType}][${taskType}]`),
      identifierValue: getIdentifier({ model, licenceType, applicant }),
      prevStatus: get(content, `status[${task.meta.previous}]`),
      newStatus: get(content, `status[${task.meta.next}]`),
      taskUrl: `${publicUrl}/tasks/${task.id}`,
      licenceNumber: model && model.licenceNumber,
      licenceUrl: `${publicUrl}/${licencePath}`,
      ...notification
    };

    return Promise.resolve()
      .then(() => loadTemplate(templateName, templateVars))
      .then(html => {
        return emailer('/custom', {
          method: 'POST',
          json: {
            to: recipient.email,
            name: recipientName,
            subject,
            html
          }
        });
      })
      .catch(e => {
        e.task = task;
        throw e;
      });
  }));
};
