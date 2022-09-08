const { get } = require('lodash');
const moment = require('moment');
const taskHelper = require('../utils/task');
const { subscribed } = require('../utils/is-subscribed');

module.exports = async ({ schema, logger, task }) => {
  logger.verbose('generating notifications for establishment task');

  const notifications = new Map();
  const { Establishment, Profile } = schema;
  const applicantId = get(task, 'data.changedBy');
  const establishmentId = get(task, 'data.establishmentId') || get(task, 'data.modelData.id') || get(task, 'data.id');
  const action = get(task, 'data.action');
  const model = get(task, 'data.model');
  const dateFormat = 'D MMM YYYY';

  const allowedActions = {
    establishment: [
      'update',
      'update-conditions',
      'grant',
      'revoke',
      'suspend',
      'reinstate',
      'condition-reminder-1-month',
      'condition-reminder-1-week',
      'condition-reminder-today',
      'condition-reminder-overdue'
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
    .scopeToEstablishment('establishments.id', establishmentId, 'admin');

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

  const notifyAdmins = (params, ignorePreferences = false) => {
    logger.verbose(`${params.logMsg}, notifying establishment admins`);
    admins.forEach(admin => {
      if (!subscribed({ establishmentId, licenceType: 'pel', profile: admin }) && !ignorePreferences) {
        return;
      }
      if (!notifications.has(admin.id)) {
        notifications.set(admin.id, { ...params, recipient: admin });
      }
    });
  };

  const notifyEnforcement = params => {
    logger.verbose(`${params.logMsg}, notifying enforcement unit`);
    const recipient = { id: 'asru', email: 'ASRUEnforcement@homeoffice.gov.uk', firstName: 'enforcement', lastName: 'team' };
    notifications.set(recipient.id, { ...params, recipient });
  };

  const notifyPilHolders = async params => {
    logger.verbose(`${params.logMsg}, notifying all PIL holders at the establishment`);
    const pilHolders = await Profile.query()
      .joinRelated('pil')
      .where('pil.establishmentId', establishmentId)
      .where('pil.status', 'active');

    pilHolders.forEach(pilh => {
      if (!notifications.has(pilh.id)) {
        notifications.set(pilh.id, { ...params, recipient: pilh });
      }
    });
  };

  const notifyPplHolders = async params => {
    logger.verbose(`${params.logMsg}, notifying all project licence holders at the establishment`);
    const pplHolders = await Profile.query()
      .joinRelated('projects')
      .where('projects.establishmentId', establishmentId)
      .where('projects.status', 'active');

    pplHolders.forEach(pplh => {
      if (!notifications.has(pplh.id)) {
        notifications.set(pplh.id, { ...params, recipient: pplh });
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
    const reminderId = task.data.reminder.id;
    const deadline = task.data.reminder.deadline;

    const reminderParams = {
      ...params,
      modelType: 'establishment',
      emailTemplate: 'condition-reminder',
      logMsg: `establishment condition is due ${when}`,
      addTaskTypeToSubject: false,
      when,
      deadline,
      identifier: `${reminderId}-${deadline}-${action}`
    };

    if (action === 'condition-reminder-overdue') {
      notifyEnforcement({
        ...reminderParams,
        emailTemplate: 'condition-reminder-overdue',
        logMsg: 'establishment condition is overdue'
      });

      return notifications;
    }

    notifyPelh(reminderParams);
    notifyAdmins(reminderParams);

    return notifications;
  }

  if (taskHelper.isSuspension(task)) {
    const suspensionParams = {
      ...params,
      modelType: 'establishment',
      emailTemplate: 'licence-suspended',
      logMsg: 'Establishment suspended',
      suspendedDate: establishment.suspendedDate && moment(establishment.suspendedDate).format(dateFormat)
    };

    notifyPelh(suspensionParams);
    notifyAdmins(suspensionParams, true);
    await notifyPilHolders(suspensionParams);
    await notifyPplHolders(suspensionParams);

    return notifications;
  }

  if (taskHelper.isReinstatement(task)) {
    const reinstatementParams = {
      ...params,
      modelType: 'establishment',
      emailTemplate: 'licence-reinstated',
      logMsg: 'Establishment reinstated',
      suspendedDate: establishment.suspendedDate && moment(establishment.suspendedDate).format(dateFormat),
      reinstatedDate: moment().format(dateFormat)
    };

    notifyPelh(reinstatementParams);
    notifyAdmins(reinstatementParams, true);
    await notifyPilHolders(reinstatementParams);
    await notifyPplHolders(reinstatementParams);

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
