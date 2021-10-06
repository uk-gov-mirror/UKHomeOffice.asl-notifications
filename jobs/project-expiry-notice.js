const moment = require('moment');
const Emailer = require('../lib/emailer');

module.exports = ({ schema, logger, publicUrl }) => {
  const { Project } = schema;

  const emailer = Emailer({ schema, logger, publicUrl });

  const expiryNotice = (upper, action) => {
    logger.debug(`Looking for projects expiring in next ${upper} months`);
    const ub = moment().add(upper, 'months').toISOString();
    const lb = moment().add(upper, 'months').subtract(1, 'week').toISOString();

    return Promise.resolve()
      .then(() => {
        return Project.query()
          .where('expiryDate', '<=', ub)
          .where('expiryDate', '>', lb)
          .where('status', 'active');
      })
      .then(models => {
        logger.debug(`Found ${models.length} projects due to expire in the next ${upper} months`);
        return models.reduce((promise, model) => {
          const task = {
            event: 'direct-notification',
            data: {
              id: model.id,
              model: 'project',
              months: upper,
              action
            }
          };
          return emailer(task);
        }, Promise.resolve());
      });
  };

  const expiredNotice = () => {
    logger.debug('Looking for projects expired in the last week');
    const ub = moment().startOf('day').toISOString();
    const lb = moment().startOf('day').subtract(1, 'week').toISOString();

    return Promise.resolve()
      .then(() => {
        return Project.query()
          .where('expiryDate', '<', ub)
          .where('expiryDate', '>', lb)
          .whereIn('status', ['active', 'expired']);
      })
      .then(models => {
        logger.debug(`Found ${models.length} projects that expired in the last week`);
        return models.reduce((promise, model) => {
          const task = {
            event: 'direct-notification',
            data: {
              id: model.id,
              model: 'project',
              action: 'project-expired'
            }
          };
          return emailer(task);
        }, Promise.resolve());
      });
  };

  return Promise.resolve()
    .then(() => expiryNotice(12, 'project-expiring-12'))
    .then(() => expiryNotice(6, 'project-expiring-6'))
    .then(() => expiryNotice(3, 'project-expiring-3'))
    .then(() => expiredNotice());
};
