const moment = require('moment');
const Emailer = require('../lib/emailer');


module.exports = ({ schema, logger, publicUrl }) => {
  const { Project } = schema;

  const emailer = Emailer({ schema, logger, publicUrl });

  const expiryNotice = (upper, action) => {
    logger.debug('Looking for projects expiring in next ${upper} months');
    const ub = moment().add(upper, 'months').toISOString();
    const lb = moment().add(upper, 'months').subtract(1, 'week').toISOString();

    return Promise.resolve()
      .then(() => {
        let query = Project.query()
          .where('expiryDate', '<=', ub)
          .where('expiryDate', '>', lb);
        if (action === 'project-expired') {
          // project may or may not already be expired
          query = query.whereIn('status', ['active', 'expired']);
        } else {
          query = query.where('status', 'active');
        }
        return query;
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

  return Promise.resolve()
    .then(() => expiryNotice(12, 'project-expiring-12'))
    .then(() => expiryNotice(6, 'project-expiring-6'))
    .then(() => expiryNotice(3, 'project-expiring-3'))
    .then(() => expiryNotice(0, 'project-expired'));
};
