const moment = require('moment');
const Emailer = require('../lib/emailer');

module.exports = ({ schema, logger, publicUrl }) => {
  const { PIL } = schema;

  const emailer = Emailer({ schema, logger, publicUrl });

  const reviewDueNotice = (upper, action) => {
    logger.debug(`Looking for PILs with review due in next ${upper} months`);
    const ub = moment().add(upper, 'months').toISOString();
    const lb = moment().add(upper, 'months').subtract(1, 'week').toISOString();

    return Promise.resolve()
      .then(() => {
        return PIL.query()
          .where('reviewDate', '<=', ub)
          .where('reviewDate', '>', lb)
          .where('status', 'active');
      })
      .then(pils => {
        logger.debug(`Found ${pils.length} PILs with review due in the next ${upper} months`);
        return pils.reduce((promise, pil) => {
          const task = {
            event: 'direct-notification',
            data: {
              id: pil.id,
              model: 'pil',
              months: upper,
              action,
              establishmentId: pil.establishmentId,
              subject: pil.profileId
            }
          };
          return emailer(task);
        }, Promise.resolve());
      });
  };

  const reviewOverdueNotice = () => {
    logger.debug('Looking for PILs with overdue review');
    const ub = moment().startOf('day').toISOString();
    const lb = moment().startOf('day').subtract(1, 'week').toISOString();

    return Promise.resolve()
      .then(() => {
        return PIL.query()
          .where('reviewDate', '<', ub)
          .where('reviewDate', '>', lb)
          .where('status', 'active');
      })
      .then(pils => {
        logger.debug(`Found ${pils.length} PILs with overdue review`);
        return pils.reduce((promise, pil) => {
          const task = {
            event: 'direct-notification',
            data: {
              id: pil.id,
              model: 'pil',
              action: 'review-overdue',
              establishmentId: pil.establishmentId,
              subject: pil.profileId
            }
          };
          return emailer(task);
        }, Promise.resolve());
      });
  };

  return Promise.resolve()
    .then(() => reviewDueNotice(3, 'review-due-3'))
    .then(() => reviewDueNotice(1, 'review-due-1'))
    .then(() => reviewOverdueNotice());
};
