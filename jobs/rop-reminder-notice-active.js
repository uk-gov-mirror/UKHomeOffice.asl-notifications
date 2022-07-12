const moment = require('moment');
const Emailer = require('../lib/emailer');

module.exports = async ({ schema, logger, publicUrl }) => {
  const { Project } = schema;

  const emailer = Emailer({ schema, logger, publicUrl });

  const monthReminderNotice = async () => {
    const year = moment().year();
    const action = `rop-reminder-month`;
    const when = 'in 1 month';

    const query = Project.query()
      .select('projects.*')
      .selectRopsDeadline(year)
      .whereRopsOutstanding(year)
      .andWhere({ status: 'active' });

    logger.debug(`Finding active projects with ROP outstanding ${year}`);

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
        project
      }
    })));
  };

  await monthReminderNotice();
};
