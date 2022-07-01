const { get } = require('lodash');
const moment = require('moment');
const taskHelper = require('../utils/task');
const { subscribedFilter, subscribed, subscribedToCollaborations } = require('../utils/is-subscribed');

module.exports = async ({ schema, logger, task }) => {
  logger.verbose('generating notifications for project task');

  const notifications = new Map();
  const { Profile, Project, ProjectEstablishment } = schema;
  const applicantId = get(task, 'data.subject');
  const action = get(task, 'data.action');
  const projectId = get(task, 'data.id');
  const months = get(task, 'data.months');
  const dateFormat = 'D MMM YYYY';

  const allowedActions = [
    'grant',
    'grant-ra',
    'update',
    'transfer',
    'revoke',
    'project-expiring-12',
    'project-expiring-6',
    'project-expiring-3',
    'project-expired',
    'ra-due-3',
    'ra-due-1',
    'ra-due-today',
    'condition-reminder-1-month',
    'condition-reminder-1-week',
    'condition-reminder-today'
  ];

  if (!allowedActions.includes(action)) {
    logger.verbose(`ignoring task: project ${action}`);
    return Promise.resolve(new Map());
  }

  const project = await Project.query().findById(projectId).withGraphFetched('[additionalEstablishments, licenceHolder, collaborators.[emailPreferences,establishments]]');

  // if the task is an unresolved transfer, we want to notify the
  // current establishment admins, not the incoming ones.
  const establishmentId = taskHelper.isUnresolvedTransfer(task)
    ? project.establishmentId
    : get(task, 'data.establishmentId') || project.establishmentId;

  const applicant = applicantId && await Profile.query().findById(applicantId);

  const licenceNumber = project.licenceNumber;
  const raDate = project.raDate && moment(project.raDate).format(dateFormat);
  const expiryDate = project.expiryDate && moment(project.expiryDate).format(dateFormat);
  const revocationDate = project.revocationDate && moment(project.revocationDate).format(dateFormat);
  const endDate = project.revocationDate || project.expiryDate;
  const ropsDate = endDate && moment(endDate).add(28, 'days').format(dateFormat);
  const publicationsDate = endDate && moment(endDate).add(6, 'months').format(dateFormat);
  const continuationDate = project.expiryDate && moment(project.expiryDate).subtract(3, 'months').format(dateFormat);

  const admins = await Profile.query()
    .withGraphFetched('emailPreferences')
    .scopeToEstablishment('establishments.id', establishmentId, 'admin')
    .then(admins => admins.filter(subscribedFilter({ establishmentId, licenceType: 'ppl' })));

  const aaAdmins = await Profile.query()
    .select('profiles.*')
    .select('establishments.id as aaEstablishmentId')
    .withGraphFetched('emailPreferences')
    .joinRelated('establishments')
    .where({ role: 'admin' })
    .whereIn('establishments.id', ProjectEstablishment.query().select('establishmentId').where({ projectId, status: 'active' }))
    .then(admins => admins.filter(admin => {
      return subscribed({ establishmentId: admin.aaEstablishmentId, licenceType: 'ppl', profile: admin });
    }));

  const hasProjectAffiliation = collaborator => {
    // check that a collaborator is affiliated to at least one of the associated establishments
    return collaborator.establishments
      .some(e => e.id === project.establishmentId || project.additionalEstablishments.some(ae => ae.id === e.id));
  };

  const notifyUser = (recipient, params) => {
    logger.verbose(`${params.logMsg}, notifying licence holder / applicant`);
    notifications.set(recipient.id, { ...params, recipient });
  };

  const notifyCollaborators = params => {
    logger.verbose(`${params.logMsg}, notifying project collaborators`);
    project.collaborators
      .filter(collaborator => hasProjectAffiliation(collaborator))
      .filter(collaborator => subscribedToCollaborations(collaborator))
      .forEach(collaborator => notifications.set(collaborator.id, { ...params, recipient: collaborator }));
  };

  const notifyAdmins = params => {
    logger.verbose(`${params.logMsg}, notifying establishment admins`);
    admins.forEach(admin => notifications.set(admin.id, { ...params, recipient: admin }));
  };

  const notifyAAAdmins = params => {
    logger.verbose(`${params.logMsg}, notifying aa establishment admins`);
    aaAdmins.forEach(admin => notifications.set(admin.id, { ...params, recipient: admin, establishmentId: admin.aaEstablishmentId }));
  };

  const params = {
    establishmentId,
    projectId,
    applicant,
    months,
    expiryDate,
    revocationDate,
    ropsDate,
    raDate,
    publicationsDate,
    continuationDate,
    licenceNumber
  };

  if (applicant) {
    logger.debug(`applicant is ${applicant.firstName} ${applicant.lastName}`);
  }

  function formatDeadline(date) {
    return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
  }

  if (taskHelper.isReminderNotice(task)) {
    const when = get(task, 'data.when');

    const reminderParams = {
      ...params,
      emailTemplate: 'condition-reminder',
      logMsg: `project condition is due ${when}`,
      addTaskTypeToSubject: false,
      when,
      deadline: task.data.reminder.deadline,
      applicant: project.licenceHolder,
      identifier: `${project.id}-${action}`
    };

    notifyUser(project.licenceHolder, reminderParams);
    notifyAdmins(reminderParams);

    return notifications;
  }

  if (taskHelper.isRaDueNotice(task)) {
    const when = get(task, 'data.when');

    const raDueParams = {
      ...params,
      emailTemplate: 'retrospective-assessment-due',
      logMsg: `retrospective assessment is due ${when}`,
      addTaskTypeToSubject: false,
      when,
      projectStatus: project.status,
      projectTitle: project.title,
      applicant: project.licenceHolder,
      identifier: `${project.id}-${action}`
    };

    notifyUser(project.licenceHolder, raDueParams);
    notifyAdmins(raDueParams);

    return notifications;
  }

  if (taskHelper.isDeadlineExtension(task)) {
    const deadlineParams = {
      ...params,
      emailTemplate: 'project-deadline-extended',
      applicant: project.licenceHolder,
      previousDeadline: formatDeadline(task.data.deadline.standard),
      newDeadline: formatDeadline(task.data.deadline.extended),
      logMsg: 'project deadline extended'
    };

    notifyUser(project.licenceHolder, deadlineParams);
    notifyAdmins(deadlineParams);
    notifyAAAdmins(deadlineParams);

    return notifications;
  }

  if (taskHelper.isExpired(task)) {
    const expiredParams = {
      ...params,
      emailTemplate: 'project-expired',
      addTaskTypeToSubject: false,
      applicant: project.licenceHolder,
      logMsg: 'project has expired',
      identifier: `${project.id}-${action}`
    };

    notifyUser(project.licenceHolder, expiredParams);
    notifyCollaborators(expiredParams);
    notifyAdmins(expiredParams);
    notifyAAAdmins(expiredParams);

    return notifications;
  }

  if (taskHelper.isExpiryNotice(task)) {
    const expiringParams = {
      ...params,
      emailTemplate: 'project-expiring',
      addTaskTypeToSubject: false,
      applicant: project.licenceHolder,
      logMsg: `project expiring in ${months} months`,
      identifier: `${project.id}-${action}`
    };

    notifyUser(project.licenceHolder, expiringParams);
    notifyAdmins(expiringParams);
    notifyAAAdmins(expiringParams);

    return notifications;
  }

  if (taskHelper.isNew(task)) {
    const newTaskParams = { ...params, emailTemplate: 'task-opened', logMsg: 'task is new' };

    notifyUser(applicant, newTaskParams);
    notifyAAAdmins(newTaskParams);

    if (taskHelper.isWithEstablishmentAdmin(task)) {
      const withAdminParams = { ...params, emailTemplate: 'task-action-required', logMsg: 'task is with admin' };
      notifyAdmins(withAdminParams);
    } else {
      notifyAdmins(newTaskParams);
    }

    return notifications;
  }

  if (taskHelper.isWithApplicant(task)) {
    const withApplicantParams = { ...params, emailTemplate: 'task-action-required', logMsg: 'task is with applicant' };

    notifyUser(applicant, withApplicantParams);
    notifyAdmins(withApplicantParams);

    return notifications;
  }

  if (taskHelper.isWithEstablishmentAdmin(task)) {
    const withAdminParams = { ...params, emailTemplate: 'task-action-required', logMsg: 'task is with admin' };

    logger.verbose('task is with admin, notifying establishment admins');
    notifyAdmins(withAdminParams);

    return notifications;
  }

  if (taskHelper.isOverTheFence(task)) {
    const overTheFenceParams = { ...params, emailTemplate: 'task-with-asru', logMsg: 'task is over the fence' };

    notifyUser(applicant, overTheFenceParams);

    return notifications;
  }

  if (taskHelper.isGranted(task)) {
    const taskGrantedParams = { ...params, emailTemplate: 'licence-granted', logMsg: 'licence is granted' };

    notifyUser(applicant, taskGrantedParams);
    notifyCollaborators(taskGrantedParams);

    if (action === 'update') {
      const licenceHolderId = get(task, 'data.data.licenceHolderId');

      if (licenceHolderId !== applicantId) {
        const licenceHolder = await Profile.query().findById(licenceHolderId);
        notifyUser(licenceHolder, { ...taskGrantedParams, logMsg: 'licence holder updated' });
      }
    }

    notifyAdmins(taskGrantedParams);
    notifyAAAdmins(taskGrantedParams);

    return notifications;
  }

  if (taskHelper.isClosed(task) && action === 'revoke') {
    const revokedParams = {
      ...params,
      emailTemplate: 'ppl-revoked',
      subject: `Important: project licence has been revoked - action required ${licenceNumber}`,
      logMsg: 'project licence revoked'
    };

    notifyUser(applicant, revokedParams);
    notifyCollaborators(revokedParams);
    notifyAdmins(revokedParams);
    notifyAAAdmins(revokedParams);

    return notifications;
  }

  if (taskHelper.isClosed(task)) {
    const taskClosedParams = { ...params, emailTemplate: 'task-closed', logMsg: 'task is closed' };

    notifyUser(applicant, taskClosedParams);
    notifyAdmins(taskClosedParams);
    notifyAAAdmins(taskClosedParams);

    return notifications;
  }

  return notifications;
};
