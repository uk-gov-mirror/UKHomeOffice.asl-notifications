const { isUndefined } = require('lodash');
const moment = require('moment');
const Emailer = require('../lib/emailer');

function expiryNotice(emailer, Project, upper, lower) {
  let action = 'expiry';
  if (upper) {
    action = `${action}-${upper}`;
  }

  const ub = moment().add(upper, 'months').toISOString();

  console.log(ub);

  return Promise.resolve()
    .then(() => {
      let query = Project.query()
        .where('status', lower ? 'active' : 'expired')
        .where('expiryDate', '<=', ub);
      if (!isUndefined(lower)) {
        const lb = moment().add(lower, 'months').toISOString();
        query = query.where('expiryDate', '>', lb);
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
    .then(() => expiryNotice(emailer, Project, 12, 6))
    .then(() => expiryNotice(emailer, Project, 6, 3))
    .then(() => expiryNotice(emailer, Project, 3, 0))
    .then(() => expiryNotice(emailer, Project, 0));
};
