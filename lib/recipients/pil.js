const { get } = require('lodash');
const taskHelper = require('../utils/task');

module.exports = ({ schema, logger, task }) => {
  logger.verbose('generating notifications for pil task');

  const notifications = new Map();
  const { Profile } = schema;
  const applicantId = get(task, 'data.subject');
  const establishmentId = get(task, 'data.establishmentId');
  const action = get(task, 'data.action');
  const allowedActions = [
    'transfer',
    'grant',
    'update',
    'revoke',
    'review',
    'update-conditions'
  ];

  const getAdmins = establishmentId => Profile.query()
    .scopeToEstablishment('establishments.id', establishmentId, 'admin');

  const getNonOwningAdmins = applicantId => Profile.query().findById(applicantId).eager('[establishments]')
    .then(applicant => applicant.establishments.filter(e => e.id !== establishmentId).map(e => e.id))
    .then(nonOwningEstablishmentIds => {
      if (nonOwningEstablishmentIds.length < 1) {
        return [];
      }

      return Profile.query()
        .joinRelation('establishments')
        .whereIn('establishmentId', nonOwningEstablishmentIds)
        .andWhere({ role: 'admin' })
        .whereNot('profiles.id', applicantId);
    });

  const getNtcos = establishmentId => Profile.query()
    .scopeToEstablishment('establishments.id', establishmentId)
    .joinRelation('roles')
    .where('roles.type', 'ntco');

  if (!allowedActions.includes(action)) {
    logger.verbose(`ignoring task: pil ${action}`);
    return Promise.resolve(new Map());
  }

  return Profile.query().findById(applicantId)
    .then(applicant => {
      logger.debug(`applicant is ${applicant.firstName} ${applicant.lastName}`);

      if (taskHelper.isNew(task)) {
        logger.verbose('task is new, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-opened', applicant, recipient: applicant });
      } else if (taskHelper.isWithApplicant(task)) {
        logger.verbose('task is with applicant, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-action-required', applicant, recipient: applicant });

      } else if (taskHelper.isOverTheFence(task)) {
        logger.verbose('task is over the fence, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'task-with-asru', applicant, recipient: applicant });

      } else if (taskHelper.isGranted(task)) {
        logger.verbose('licence is granted, notifying applicant');
        notifications.set(applicantId, { emailTemplate: 'licence-granted', applicant, recipient: applicant });

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

                  } else if (taskHelper.isGranted(task)) {
                    logger.verbose('licence is granted, notifying NTCO');
                    notifications.set(profile.id, { emailTemplate: 'licence-granted', applicant, recipient: profile });

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

                  } else if (taskHelper.isGranted(task)) {
                    logger.verbose('licence is granted, notifying admin');
                    notifications.set(profile.id, { emailTemplate: 'licence-granted', applicant, recipient: profile });

                  } else if (taskHelper.isClosed(task)) {
                    logger.verbose('task is closed, notifying admin');
                    notifications.set(profile.id, { emailTemplate: 'task-closed', applicant, recipient: profile });
                  }
                });
              });
          }
        })
        .then(() => {
          if (taskHelper.isResolved(task)) {
            // notify any other associated establishment admins that a PIL has been granted / amended / transferred / revoked
            return getNonOwningAdmins(applicantId)
              .then(otherAdmins => {
                otherAdmins.map(profile => {
                  switch (action) {
                    case 'grant':
                      logger.verbose('PIL is granted, notifying non-owning-establishment admins');
                      notifications.set(profile.id, { emailTemplate: 'associated-pil-granted', applicant, recipient: profile });
                      break;
                    case 'transfer':
                      logger.verbose('PIL is transferred, notifying non-owning-establishment admins');
                      notifications.set(profile.id, { emailTemplate: 'associated-pil-transferred', applicant, recipient: profile });
                      break;
                    case 'revoke':
                      logger.verbose('PIL is revoked, notifying non-owning-establishment admins');
                      notifications.set(profile.id, { emailTemplate: 'associated-pil-revoked', applicant, recipient: profile });
                      break;
                    default:
                      logger.verbose('PIL is updated, notifying non-owning-establishment admins');
                      notifications.set(profile.id, { emailTemplate: 'associated-pil-amended', applicant, recipient: profile });
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
