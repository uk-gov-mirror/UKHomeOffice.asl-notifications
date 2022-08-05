const StatsD = require('hot-shots');
const statsd = new StatsD();

const jobs = [
  './project-expiry-notice',
  './ra-due-notice',
  './rop-reminder-notice-deadline',
  './reminder-notice',
  './pil-review-notice',
  './ra-due-notice'
];

module.exports = async (params) => {
  let hasFailure = false;
  for (const job of jobs) {
    params.logger.debug(`Executing job ${job}`);
    await Promise.resolve()
      .then(() => require(job))
      .then(fn => fn(params))
      .catch(e => {
        params.logger.error({ message: e.message, stack: e.stack, ...e });
        statsd.increment('asl.job.error', 1);
        hasFailure = true;
      });
  }
  if (hasFailure) {
    process.exit(1);
  }
};
