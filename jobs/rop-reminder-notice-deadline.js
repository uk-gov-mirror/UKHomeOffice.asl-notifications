const moment = require('moment');
const Emailer = require('../lib/emailer');

module.exports = async ({ schema, logger, publicUrl }) => {
  const { Project, knex } = schema;

  const emailer = Emailer({ schema, logger, publicUrl });

  const reminderNotice = async ({ deadline = null, actionSuffix, when }) => {
    const year = moment().utc().year();
    const action = `rop-reminder-${actionSuffix}`;

    const query = knex.queryBuilder().select('with_deadline.*')
      .from(
        Project.query()
          .select('projects.*')
          .selectRopsDeadline(year)
          .whereRopsOutstanding(year)
          .as('with_deadline')
          .toKnexQuery())
      .whereBetween('with_deadline.rops_deadline', [deadline.startOf('day').toISOString(), deadline.endOf('day').toISOString()]);

    logger.debug(`Finding projects with ROP due ${when}`);

    const projects = await query;

    logger.debug(`Found ${projects.length} projects with ROPs due`);

    return Promise.all(projects.map(project => emailer({
      event: 'direct-notification',
      data: {
        id: project.id,
        model: 'project',
        establishmentId: project.establishmentId,
        action,
        when,
        project,
        ropsDeadline: project.ropsDeadline
      }
    })));
  };

  await reminderNotice({ actionSuffix: 'week', deadline: moment().utc().add('1', 'week'), when: 'in 1 week' });
  await reminderNotice({ actionSuffix: 'today', deadline: moment().utc(), when: 'today' });
};
