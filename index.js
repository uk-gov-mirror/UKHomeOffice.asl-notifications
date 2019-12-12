const app = require('./lib/app');
const settings = require('./config');
const Logger = require('./lib/utils/logger');
const logger = Logger(settings);

const server = app({ settings, logger }).listen(settings.port, (err, result) => {
  if (err) {
    return logger.error(err.message);
  }
  logger.info(`Listening on port ${server.address().port}`);
});
