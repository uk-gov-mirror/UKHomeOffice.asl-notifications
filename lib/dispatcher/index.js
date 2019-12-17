const content = require('./content');
const mustache = require('mustache');
const loadTemplate = require('./load-template');
const getModel = require('./get-model');
const getType = require('./get-type');
const getIdentifier = require('./get-identifier');

// todo: add content for new email types and remove mapping to old emails
const oldTemplateMap = {
  'task-opened': 'task-change',
  'task-closed': 'task-change',
  'task-with-asru': 'task-change',
  'profile-updated': 'task-change',
  'task-action-required': 'task-action'
};

module.exports = ({ emailer, logger, task, notifications, publicUrl }) => {
  const model = getModel(task);
  const type = getType(task);

  return Promise.all(Array.from(notifications).map(([id, notification]) => {
    logger.debug(`sending ${notification.emailTemplate} to ${notification.recipient.email}`);

    const applicant = notification.applicant;
    const recipient = notification.recipient;
    const templateName = oldTemplateMap[notification.emailTemplate];
    const subject = `${content.subject[templateName]}: ${type}`;

    const templateVars = {
      taskType: content.type[model][type],
      name: `${recipient.firstName} ${recipient.lastName}`,
      identifier: content.identifier[model][type],
      identifierValue: getIdentifier({ task, model, applicant }),
      prevStatus: content.status[task.meta.previous],
      newStatus: content.status[task.meta.next],
      taskUrl: `${publicUrl}/tasks/${task.id}`
    };

    return Promise.resolve()
      .then(() => loadTemplate(templateName))
      .then(templateString => mustache.render(templateString, templateVars))
      .then(html => {
        return emailer('/custom', {
          method: 'POST',
          json: {
            to: recipient.email,
            subject,
            html
          }
        });
      })
      .catch(err => {
        logger.error(err.message);
      });
  }));
};
