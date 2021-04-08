const api = require('@asl/service/api');
const errorHandler = require('@asl/service/lib/error-handler');
const db = require('@asl/schema');
const Emailer = require('./emailer');

module.exports = ({ settings, logger }) => {
  const app = api(settings);
  const schema = db(settings.db);
  const publicUrl = settings.publicUrl;
  const emailer = Emailer({ schema, publicUrl, logger });

  app.post('/',
    (req, res, next) => {
      return Promise.resolve()
        .then(() => emailer(req.body))
        .then(() => next())
        .catch(next);
    },
    (req, res) => res.json({})
  );

  app.use(errorHandler(settings));

  return app;
};
