const { pick } = require('lodash');
const Recipients = require('./recipients');
const Dispatcher = require('./dispatcher');
const Notifier = require('./utils/notifier');

module.exports = ({ publicUrl, schema, logger }) => {
  const recipientBuilder = Recipients({ schema, logger, publicUrl });
  const notify = Notifier({ schema, logger });
  const dispatch = Dispatcher({ schema, notify, logger, publicUrl });

  return task => {
    logger.info('task received', { ...pick(task, ['id', 'event']), ...pick(task.data, ['model', 'action']) });
    return Promise.resolve()
      .then(() => recipientBuilder.getNotifications(task))
      .then(notifications => {
        if (notifications.size) {
          logger.info(`sending ${notifications.size} notification(s)`);
          return dispatch({ task, notifications });
        }
        logger.info(`nothing to send`);
      });
  };

};
