try {
  // eslint-disable-next-line
  require('dotenv/config');
} catch (e) { /* do nothing */ }

const path = require('path');
const db = require('@asl/schema');
const StatsD = require('hot-shots');
const statsd = new StatsD();

const args = require('minimist')(process.argv.slice(2));
const job = args._[0];

const settings = require('../config');
const Logger = require('../lib/utils/logger');
const logger = Logger(settings);
const SendEmail = require('../lib/utils/send-email');

const run = fn => {
  const schema = db(settings.db);
  return Promise.resolve()
    .then(() => fn({
      schema,
      logger,
      sendEmail: SendEmail({ emailServiceHost: settings.emailer.host }),
      publicUrl: settings.publicUrl
    }));
};

if (!job) {
  console.error(`Job must be defined.\n\nUsage:  npm run job -- ./jobs/file.js\n\n`);
  statsd.increment('asl.job.error', 1);
  process.exit(1);
}

Promise.resolve()
  .then(() => {
    return require(path.resolve(process.cwd(), job));
  })
  .then(fn => {
    return run(fn);
  })
  .then(() => {
    process.exit(0);
  })
  .catch(e => {
    logger.error({ message: e.message, stack: e.stack, ...e });
    statsd.increment('asl.job.error', 1);
    process.exit(1);
  });
