const mustache = require('mustache');
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
  const model = await getModel({ schema, licenceType, task });

  return Promise.all(Array.from(notifications).map(([id, notification]) => {
    logger.debug(`sending ${notification.emailTemplate} to ${notification.recipient.email}`);

    const applicant = notification.applicant;
    const recipient = notification.recipient;
    const templateName = oldTemplateMap[notification.emailTemplate] || notification.emailTemplate;
    const subject = `${content.subject[templateName]}: ${content.type[licenceType][taskType]}`;
    const recipientName = `${recipient.firstName} ${recipient.lastName}`;

    const templateVars = {
      licenceType: content.licenceType[licenceType],
      grantType: content.grantType[taskType],
      taskType: content.type[licenceType][taskType],
      identifier: content.identifier[licenceType][taskType],
      identifierValue: getIdentifier({ model, licenceType, applicant }),
      prevStatus: content.status[task.meta.previous],
      newStatus: content.status[task.meta.next],
      taskUrl: `${publicUrl}/tasks/${task.id}`,
      licenceNumber: model.licenceNumber,
      licenceUrl: `${publicUrl}/${licencePath}`
    };

    return Promise.resolve()
      .then(() => loadTemplate(templateName))
      .then(templateString => mustache.render(templateString, templateVars))
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
      });
  }));
};
