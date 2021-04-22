const moment = require('moment');
const Emailer = require('../lib/emailer');

function expiryNotice(emailer, Project, upper, action) {
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
}

module.exports = ({ schema, logger, publicUrl }) => {
  const { Project } = schema;

  const emailer = Emailer({ schema, logger, publicUrl });

  return Promise.resolve()
    .then(() => expiryNotice(emailer, Project, 12, 'project-expiring-12'))
    .then(() => expiryNotice(emailer, Project, 6, 'project-expiring-6'))
    .then(() => expiryNotice(emailer, Project, 3, 'project-expiring-3'))
    .then(() => expiryNotice(emailer, Project, 0, 'project-expired'));
};
