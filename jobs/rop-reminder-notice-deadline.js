const moment = require('moment');
const Emailer = require('../lib/emailer');
const { uniqBy } = require('lodash');

module.exports = async ({ schema, logger, publicUrl }) => {
  const { Project, knex } = schema;

  const projectsWithRopsOutstanding = (deadline, year) => {
    return knex.queryBuilder().select('with_deadline.*')
      .from(
        Project.query()
          .select('projects.*')
          .selectRopsDeadline(year)
          .whereRopsOutstanding(year)
          .as('with_deadline')
          .toKnexQuery())
      .whereBetween('with_deadline.rops_deadline', [deadline.startOf('day').toISOString(), deadline.endOf('day').toISOString()])
      .andWhere(queryBuilder => queryBuilder.whereNull('with_deadline.expiry_date').orWhere('with_deadline.expiry_date', '>', `${year}-01-01`))
      .andWhere(queryBuilder => queryBuilder.whereNull('with_deadline.revocation_date').orWhere('with_deadline.revocation_date', '>', `${year}-01-01`));
  };

  const emailer = Emailer({ schema, logger, publicUrl });

  const reminderNotice = async ({ deadline = null, actionSuffix, when }) => {
    const year = moment().utc().year();
    const action = `rop-reminder-${actionSuffix}`;

    const thisYearProjects = await projectsWithRopsOutstanding(deadline, year);

    logger.debug(`Found ${thisYearProjects.length} projects with ROPs due`);

    const lastYearProjects = await projectsWithRopsOutstanding(deadline, year - 1);

    logger.debug(`Found ${lastYearProjects.length} projects with ROPs due from last year`);

    const projects = uniqBy([...lastYearProjects, ...thisYearProjects], project => project.id);

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
