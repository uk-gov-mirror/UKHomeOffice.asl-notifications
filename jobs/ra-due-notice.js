const moment = require('moment');
const Emailer = require('../lib/emailer');

module.exports = ({ schema, logger, publicUrl }) => {
  const { Project } = schema;

  const emailer = Emailer({ schema, logger, publicUrl });

  const raDueNotice = (upper, action) => {
    logger.debug(`Looking for projects due an RA in next ${upper} month(s)`);
    const ub = upper === 0 ? moment().endOf('day').toISOString() : moment().add(upper, 'months').toISOString();
    const lb = upper === 0 ? moment().startOf('day').toISOString() : moment().add(upper, 'months').subtract(1, 'week').toISOString();

    return Promise.resolve()
      .then(() => {
        return Project.query()
          .where('raDate', '<=', ub)
          .where('raDate', '>', lb)
          .whereIn('status', ['expired', 'revoked'])
          .whereNotExists(
            Project.relatedQuery('retrospectiveAssessments').whereIn('status', ['submitted', 'granted'])
          );
      })
      .then(projects => {
        logger.debug(`Found ${projects.length} projects due an RA in the next ${upper} month(s)`);
        return projects.reduce((promise, project) => {
          const task = {
            event: 'direct-notification',
            data: {
              id: project.id,
              model: 'project',
              when: upper === 0 ? 'today' : `in ${upper} month${upper !== 1 ? 's' : ''}`,
              action
            }
          };
          return emailer(task);
        }, Promise.resolve());
      });
  };

  return Promise.resolve()
    .then(() => raDueNotice(3, 'ra-due-3'))
    .then(() => raDueNotice(1, 'ra-due-1'))
    .then(() => raDueNotice(0, 'ra-due-today'));
};
