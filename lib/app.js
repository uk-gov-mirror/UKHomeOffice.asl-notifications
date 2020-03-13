const { pick } = require('lodash');
const api = require('@asl/service/api');
const db = require('@asl/schema');
const Recipients = require('./recipients');
const notify = require('./dispatcher');
const Emailer = require('./utils/emailer');

module.exports = ({ settings, logger }) => {
  const app = api(settings);
  const schema = db(settings.db);
  const recipientBuilder = Recipients({ schema, logger });
  const publicUrl = settings.publicUrl;
  const emailer = Emailer(settings.emailer.host, logger);

  app.post('/',
    (req, res, next) => {
      const task = req.body;
      logger.info('task received', { ...pick(task, ['id', 'event']), ...pick(task.data, ['model', 'action']) });

      return Promise.resolve()
        .then(() => recipientBuilder.getNotifications(task))
        .then(notifications => {
          if (notifications.size) {
            logger.info(`sending ${notifications.size} notification(s)`);
            return notify({ emailer, logger, task, notifications, publicUrl });
          }
          logger.info(`nothing to send`);
        })
        .then(() => next())
        .catch(next);
    },
    (req, res) => res.json({})
  );

  return app;
};
