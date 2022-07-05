const moment = require('moment');
const Emailer = require('../lib/emailer');

module.exports = async ({ schema, logger, publicUrl }) => {
  const { Reminder } = schema;

  const emailer = Emailer({ schema, logger, publicUrl });

  const reminderNotice = async ({ value, unit }) => {
    const when = value ? `in ${value} ${unit}` : unit;
    const action = `condition-reminder-${value ? `${value}-${unit}` : unit}`;

    logger.debug(`Looking for reminders due ${when}`);

    let start = moment();
    let end = moment();

    switch (unit) {
      case 'week':
        start = moment().add(1, 'day');
        end = moment().add(value, 'week');
        break;

      case 'month':
        start = moment().add(8, 'days');
        end = moment().add(value, 'month');
        break;

      case 'overdue':
        start = moment().subtract(1, 'day');
        end = moment().subtract(1, 'day');
        break;
    }

    const reminders = await Reminder.query()
      .where('deadline', '>', start.startOf('day').toISOString())
      .where('deadline', '<=', end.endOf('day').toISOString())
      .where('status', 'active');

    logger.debug(`Found ${reminders.length} reminders due`);

    return Promise.all(reminders.map(reminder => emailer({
      event: 'direct-notification',
      data: {
        id: reminder.modelId,
        model: reminder.modelType,
        establishmentId: reminder.establishmentId,
        when,
        action,
        reminder
      }
    })));
  };

  await reminderNotice({ value: 1, unit: 'month' });
  await reminderNotice({ value: 1, unit: 'week' });
  await reminderNotice({ unit: 'today' });
  await reminderNotice({ unit: 'overdue' });
};
