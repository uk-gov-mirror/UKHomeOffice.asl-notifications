const { get } = require('lodash');
const moment = require('moment');
const taskHelper = require('../utils/task');
const getTaskType = require('../dispatcher/get-task-type');
const { subscribedFilter } = require('../utils/is-subscribed');

module.exports = async ({ schema, logger, task, publicUrl }) => {
  logger.verbose('generating notifications for Training PIL task');

  const notifications = new Map();
  const { Profile, TrainingPil } = schema;

  const pilId = get(task, 'data.id');
  const action = get(task, 'data.action');
  const dateFormat = 'D MMM YYYY';

  const allowedActions = [
    'grant',
    'update',
    'revoke'
  ];

  if (!allowedActions.includes(action)) {
    logger.verbose(`ignoring task: pil ${action}`);
    return Promise.resolve(new Map());
  }

  const trainingPil = await TrainingPil.query()
    .findById(pilId)
    .withGraphFetched('[profile, trainingCourse.project.licenceHolder]');

  const licenceHolder = trainingPil.profile;
  const trainingCourse = trainingPil.trainingCourse;
  const trainingCourseOwner = trainingCourse.project.licenceHolder;
  const establishmentId = trainingCourse.establishmentId;

  const ntcos = await Profile.query()
    .scopeToEstablishment('establishments.id', establishmentId)
    .joinRelation('roles')
    .where('roles.type', 'ntco');

  const admins = await Profile.query()
    .withGraphFetched('emailPreferences')
    .scopeToEstablishment('establishments.id', establishmentId, 'admin')
    .then(admins => admins.filter(subscribedFilter({ establishmentId, licenceType: 'pil' })));

  const notifyTrainingCourseOwner = params => {
    logger.verbose(`${params.logMsg}, notifying training course owner`);
    notifications.set(trainingCourseOwner.id, { ...params, recipient: trainingCourseOwner });
  };

  const notifyNTCOs = params => {
    logger.verbose(`${params.logMsg}, notifying NTCOs`);
    ntcos.forEach(ntco => notifications.set(ntco.id, { ...params, recipient: ntco }));
  };

  const notifyAdmins = params => {
    logger.verbose(`${params.logMsg}, notifying establishment admins`);
    admins.forEach(admin => notifications.set(admin.id, { ...params, recipient: admin }));
  };

  const params = {
    establishmentId,
    pilId,
    pilExpiryDate: trainingPil && moment(trainingPil.expiryDate).format(dateFormat),
    applicant: licenceHolder,
    licenceHolderName: `${licenceHolder.firstName} ${licenceHolder.lastName}`,
    trainingCourseTitle: trainingCourse.title,
    trainingCourseUrl: `${publicUrl}/establishments/${establishmentId}/pils/courses/${trainingCourse.id}?notification=${task.id}`,
    addTaskTypeToSubject: false
  };

  if (taskHelper.isNew(task) || taskHelper.isWithNtco(task)) {
    const newTaskParams = { ...params, emailTemplate: 'task-opened', logMsg: 'task is new' };

    notifyTrainingCourseOwner(newTaskParams);
    notifyNTCOs({ ...newTaskParams, emailTemplate: 'task-action-required', logMsg: 'Training PIL is awaiting endorsement' });

    return notifications;
  }

  if (taskHelper.isWithApplicant(task)) {
    const withApplicantParams = { ...params, emailTemplate: 'task-action-required', logMsg: 'task is with applicant' };

    notifyTrainingCourseOwner(withApplicantParams);

    return notifications;
  }

  if (taskHelper.isResolved(task)) {
    switch (action) {
      case 'grant':
        const emailTemplate = getTaskType(task) === 'amendment' ? 'training-pil-amended' : 'training-pil-granted';
        const grantedParams = { ...params, emailTemplate, logMsg: 'licence granted' };

        notifyTrainingCourseOwner(grantedParams);
        notifyNTCOs(grantedParams);
        notifyAdmins(grantedParams);
        break;

      case 'revoke':
        const revokedParams = { ...params, emailTemplate: 'training-pil-revoked', logMsg: 'licence revoked' };
        notifyTrainingCourseOwner(revokedParams);
        notifyNTCOs(revokedParams);
        notifyAdmins(revokedParams);
        break;

      default:
        const amendedParams = { ...params, emailTemplate: 'task-closed', logMsg: 'licence amended' };
        notifyTrainingCourseOwner(amendedParams);
        notifyNTCOs(amendedParams);
        notifyAdmins(amendedParams);
    }

    return notifications;
  }

  if (taskHelper.isRejected(task)) {
    const taskClosedParams = { ...params, emailTemplate: 'training-pil-rejected', logMsg: 'Training pil was rejected' };

    notifyTrainingCourseOwner(taskClosedParams);
    notifyNTCOs(taskClosedParams);
    notifyAdmins(taskClosedParams);

    return notifications;
  }

  if (taskHelper.isClosed(task)) { // discarded / withdrawn tasks
    const taskClosedParams = { ...params, emailTemplate: 'task-closed', logMsg: 'task is closed' };
    notifyTrainingCourseOwner(taskClosedParams);

    return notifications;
  }

  return notifications;
};
