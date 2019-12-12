const api = require('@asl/service/api');
const db = require('@asl/schema');
const Recipients = require('./recipients');
const util = require('util');

module.exports = ({ settings, logger }) => {
  const app = api(settings);
  const schema = db(settings.db);

  app.post('/',
    (req, res, next) => {
      const recipientBuilder = Recipients({ schema, logger });
      const task = req.body;
      console.log('task', util.inspect(task, { showHidden: false, depth: null }));

      logger.info('task received', { task });

      return Promise.resolve()
        .then(() => recipientBuilder.getRecipientList(task))
        .then(recipients => {
          // then notify recipients
          console.log('recipients', recipients);
        })
        .then(() => next())
        .catch(next);
    },
    (req, res) => res.json({})
  );

  return app;
};
