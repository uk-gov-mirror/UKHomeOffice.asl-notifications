const { get } = require('lodash');
const taskHelper = require('../utils/task');

module.exports = ({ schema, logger, task }) => {
  logger.verbose('generating notifications for pil task');

  const notifications = new Map();
  const { Profile } = schema;
  const applicantId = get(task, 'data.subject');
  const establishmentId = get(task, 'data.establishmentId');

  const getAdmins = establishmentId => Profile.query()
    .scopeToEstablishment('establishments.id', establishmentId, 'admin');

  const getNtcos = establishmentId => Profile.query()
    .scopeToEstablishment('establishments.id', establishmentId)
    .joinRelation('roles')
    .where('roles.type', 'ntco');

  return Profile.query().findById(applicantId)
    .then(applicant => {
      logger.verbose(`applicant is ${applicant.firstName} ${applicant.lastName}`);

      if (taskHelper.isNew(task)) {
        logger.verbose('task is new, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-opened', applicant, recipient: applicant });

      } else if (taskHelper.isWithApplicant(task)) {
        logger.verbose('task is with applicant, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-action-required', applicant, recipient: applicant });

      } else if (taskHelper.isOverTheFence(task)) {
        logger.verbose('task is over the fence, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-with-asru', applicant, recipient: applicant });

      } else if (taskHelper.isClosed(task)) {
        logger.verbose('task is closed, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-closed', applicant, recipient: applicant });
      }

      return Promise.resolve()
        .then(() => {
          if (taskHelper.isWithNtco(task) || taskHelper.isWithApplicant(task) || taskHelper.isClosed(task)) {
            return getNtcos(establishmentId)
              .then(ntcos => {
                ntcos.map(profile => {
                  if (taskHelper.isWithNtco(task)) {
                    logger.verbose('task is awaiting endorsement, notifying NTCO');
                    notifications.set(profile.id, { emailTemplate: 'task-action-required', applicant, recipient: profile });

                  } else if (taskHelper.isWithApplicant(task)) {
                    logger.verbose('task is returned / recalled, notifying NTCO');
                    notifications.set(profile.id, { emailTemplate: 'task-closed', applicant, recipient: profile });

                  } else if (taskHelper.isClosed(task)) {
                    logger.verbose('task is closed, notifying NTCO');
                    notifications.set(profile.id, { emailTemplate: 'task-closed', applicant, recipient: profile });
                  }
                });
              });
          }
        })
        .then(() => {
          if (taskHelper.isNew(task) || taskHelper.isClosed(task)) {
            // notify all users with admin perms at the establishment
            return getAdmins(establishmentId)
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
          }
        })
        .then(() => {
          if (!taskHelper.isTransfer(task)) {
            return;
          }

          const outgoingEstablishmentId = get(task, 'data.data.establishment.from.id');

          return getNtcos(outgoingEstablishmentId)
            .then(ntcos => {
              ntcos.map(profile => {
                if (taskHelper.isNew(task)) {
                  logger.verbose('transfer task is new, notifying outgoing NTCO');
                  notifications.set(profile.id, { emailTemplate: 'task-opened', applicant, recipient: profile });
                } else if (taskHelper.isClosed(task)) {
                  logger.verbose('transfer task is closed, notifying outgoing NTCO');
                  notifications.set(profile.id, { emailTemplate: 'task-closed', applicant, recipient: profile });
                }
              });
            })
            .then(() => getAdmins(outgoingEstablishmentId))
            .then(admins => {
              admins.map(profile => {
                if (taskHelper.isNew(task)) {
                  logger.verbose('transfer task is new, notifying outgoing admin');
                  notifications.set(profile.id, { emailTemplate: 'task-opened', applicant, recipient: profile });

                } else if (taskHelper.isClosed(task)) {
                  logger.verbose('transfer task is closed, notifying outgoing admin');
                  notifications.set(profile.id, { emailTemplate: 'task-closed', applicant, recipient: profile });
                }
              });
            });
        });
    })
    .then(() => notifications);
};
