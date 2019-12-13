const fetch = require('r2');
const { pick } = require('lodash');
const api = require('@asl/service/api');
const db = require('@asl/schema');
const Recipients = require('./recipients');
const notify = require('./dispatcher');

const util = require('util');

module.exports = ({ settings, logger }) => {
  const app = api(settings);
  const schema = db(settings.db);
  const recipientBuilder = Recipients({ schema, logger });
  const emailer = (path, params) => fetch(`${settings.emailer.host}${path}`, params);
  const publicUrl = settings.publicUrl;

  app.post('/',
    (req, res, next) => {
      const task = req.body;

      // console.log('task', util.inspect(task, { showHidden: false, depth: null }));
      logger.info('task received', { ...pick(task, ['id', 'event']), model: task.data.model });

      return Promise.resolve()
        .then(() => recipientBuilder.getNotifications(task))
        .then(notifications => {
          if (notifications.size) {
            logger.info(`sending ${notifications.size} notification(s)`);
            return notify({ emailer, logger, task, notifications, publicUrl });
          } else {
            logger.info(`nothing to send`);
          }
        })
        .then(() => next())
        .catch(next);
    },
    (req, res) => res.json({})
  );

  return app;
};
