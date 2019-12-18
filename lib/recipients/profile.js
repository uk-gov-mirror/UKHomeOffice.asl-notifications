const { get } = require('lodash');
const taskHelper = require('../utils/task');

module.exports = ({ schema, logger, task }) => {
  logger.verbose('generating notifications for profile task');

  const notifications = new Map();
  const { Profile } = schema;
  const applicantId = get(task, 'data.subject');
  const status = get(task, 'status');
  const model = get(task, 'data.model');
  const action = get(task, 'data.action');
  const isAutoresolvingProfileUpdate = status === 'autoresolved' && model === 'profile' && action === 'update';

  const getAdmins = establishmentIds => Profile.query()
    .from('profiles')
    .join('permissions', 'profiles.id', 'permissions.profileId')
    .where('permissions.role', 'admin')
    .whereIn('permissions.establishmentId', establishmentIds)
    .groupBy('profiles.id');

  const getNtcos = establishmentIds => Profile.query()
    .from('profiles')
    .join('roles', 'profiles.id', 'roles.profileId')
    .where('roles.type', 'ntco')
    .whereIn('roles.establishmentId', establishmentIds)
    .groupBy('profiles.id');

  return Profile.query().findById(applicantId).eager('[establishments]')
    .then(applicant => {
      logger.debug(`applicant is ${applicant.firstName} ${applicant.lastName}`);

      if (isAutoresolvingProfileUpdate) {
        logger.verbose('profile update was autoresolved, notifying applicant only');
        notifications.set(applicantId, { emailTemplate: 'profile-updated', applicant, recipient: applicant });
        return;
      }

      if (taskHelper.isWithApplicant(task)) {
        logger.verbose('task is with applicant, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-action-required', applicant, recipient: applicant });

      } else if (taskHelper.isOverTheFence(task)) {
        logger.verbose('task is over the fence, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-with-asru', applicant, recipient: applicant });

      } else if (taskHelper.isClosed(task)) {
        logger.verbose('task is closed, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-closed', applicant, recipient: applicant });
      }

      if (taskHelper.isNew(task) || taskHelper.isClosed(task)) {
        const relatedEstablishmentIds = applicant.establishments.map(e => e.id);

        return Promise.resolve()
          .then(() => {
            return getAdmins(relatedEstablishmentIds)
              .then(admins => {
                admins.map(profile => {
                  if (taskHelper.isNew(task)) {
                    logger.verbose('task is new, notifying admin');
                    notifications.set(profile.id, { emailTemplate: 'task-opened', applicant, recipient: profile });

                  } else if (taskHelper.isClosed(task)) {
                    logger.verbose('task is closed, notifying admin');
                    notifications.set(profile.id, { emailTemplate: 'task-closed', applicant, recipient: profile });
                  }
                });
              });
          })
          .then(() => {
            return getNtcos(relatedEstablishmentIds)
              .then(ntcos => {
                ntcos.map(profile => {
                  if (taskHelper.isNew(task)) {
                    logger.verbose('task is new, notifying ntco');
                    notifications.set(profile.id, { emailTemplate: 'task-opened', applicant, recipient: profile });

                  } else if (taskHelper.isClosed(task)) {
                    logger.verbose('task is closed, notifying ntco');
                    notifications.set(profile.id, { emailTemplate: 'task-closed', applicant, recipient: profile });
                  }
                });
              });
          });
      }
    })
    .then(() => notifications);
};
