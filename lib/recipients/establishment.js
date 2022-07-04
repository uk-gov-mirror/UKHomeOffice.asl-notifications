const { get } = require('lodash');
const taskHelper = require('../utils/task');
const { subscribedFilter } = require('../utils/is-subscribed');

module.exports = async ({ schema, logger, task }) => {
  logger.verbose('generating notifications for establishment task');

  const notifications = new Map();
  const { Establishment, Profile } = schema;
  const applicantId = get(task, 'data.changedBy');
  const establishmentId = get(task, 'data.establishmentId') || get(task, 'data.modelData.id');
  const action = get(task, 'data.action');
  const model = get(task, 'data.model');

  const allowedActions = {
    establishment: [
      'update',
      'update-conditions',
      'grant',
      'revoke',
      'condition-reminder-1-month',
      'condition-reminder-1-week',
      'condition-reminder-today'
    ],
    place: ['create', 'update', 'delete'],
    role: ['create', 'delete']
  };

  if (!allowedActions[model].includes(action)) {
    logger.verbose(`ignoring task: ${model} ${action}`);
    return Promise.resolve(new Map());
  }

  const establishment = await Establishment.query().findById(establishmentId);
  const applicant = applicantId && await Profile.query().findById(applicantId);

  const pelh = await Profile.query()
    .joinRelated('roles')
    .where('roles.type', 'pelh')
    .where('roles.establishmentId', establishmentId);

  const admins = await Profile.query()
    .withGraphFetched('emailPreferences')
    .scopeToEstablishment('establishments.id', establishmentId, 'admin')
    .then(admins => admins.filter(subscribedFilter({ establishmentId, licenceType: 'pel' })));

  const notifyUser = (recipient, params) => {
    logger.verbose(`${params.logMsg}, notifying licence holder / applicant`);
    notifications.set(recipient.id, { ...params, recipient });
  };

  const notifyPelh = params => {
    logger.verbose(`${params.logMsg}, notifying establishment licence holder(s)`);
    pelh.forEach(lh => {
      if (!notifications.has(lh.id)) {
        notifications.set(lh.id, { ...params, recipient: lh });
      }
    });
  };

  const notifyAdmins = params => {
    logger.verbose(`${params.logMsg}, notifying establishment admins`);
    admins.forEach(admin => {
      if (!notifications.has(admin.id)) {
        notifications.set(admin.id, { ...params, recipient: admin });
      }
    });
  };

  const params = {
    establishmentId,
    licenceNumber: establishment.licenceNumber,
    applicant
  };

  if (applicant) {
    logger.debug(`applicant is ${applicant.firstName} ${applicant.lastName}`);
  }

  if (taskHelper.isReminderNotice(task)) {
    const when = get(task, 'data.when');

    const reminderParams = {
      ...params,
      modelType: 'establishment',
      emailTemplate: 'condition-reminder',
      logMsg: `establishment condition is due ${when}`,
      addTaskTypeToSubject: false,
      when,
      deadline: task.data.reminder.deadline,
      identifier: `${establishmentId}-${action}`
    };

    notifyPelh(reminderParams);
    notifyAdmins(reminderParams);

    return notifications;
  }

  if (taskHelper.isWithApplicant(task)) {
    const withApplicantParams = { ...params, emailTemplate: 'task-action-required', logMsg: 'task is with applicant' };

    notifyUser(applicant, withApplicantParams);
    notifyAdmins(withApplicantParams);

    return notifications;
  }

  if (taskHelper.isOverTheFence(task)) {
    const overTheFenceParams = { ...params, emailTemplate: 'task-with-asru', logMsg: 'task is over the fence' };

    notifyUser(applicant, overTheFenceParams);
    notifyAdmins(overTheFenceParams);

    return notifications;
  }

  if (taskHelper.isGranted(task)) {
    const emailTemplate = ['place', 'role'].includes(model) ? 'licence-amended' : 'licence-granted';
    const taskGrantedParams = { ...params, emailTemplate, logMsg: 'licence is granted' };

    notifyUser(applicant, taskGrantedParams);
    notifyAdmins(taskGrantedParams);

    return notifications;
  }

  if (taskHelper.isClosed(task)) {
    const taskClosedParams = { ...params, emailTemplate: 'task-closed', logMsg: 'task is closed' };

    notifyUser(applicant, taskClosedParams);
    notifyAdmins(taskClosedParams);

    return notifications;
  }

  return notifications;
};
