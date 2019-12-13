const { get } = require('lodash');
const taskHelper = require('../utils/task');

module.exports = ({ schema, task }) => {
  const recipients = new Map();

  const { Profile } = schema;

  const applicantId = get(task, 'data.changedBy');
  const applicant = get(task, 'meta.user.profile');
  const establishmentId = get(task, 'data.establishmentId');

  return Promise.resolve()
    .then(() => {
      if (taskHelper.isNew(task)) {
        recipients.set(applicantId, { email: 'task-created', profile: applicant });

      } else if (taskHelper.isWithApplicant(task)) {
        recipients.set(applicantId, { email: 'task-action-required', profile: applicant });

      } else if (taskHelper.isOverTheFence(task)) {
        recipients.set(applicantId, { email: 'task-with-asru', profile: applicant });

      } else if (taskHelper.isClosed(task)) {
        recipients.set(applicantId, { email: 'task-closed', profile: applicant });
      }

      if (taskHelper.isWithEstablishmentAdmin(task) || taskHelper.isNew(task) || taskHelper.isClosed(task)) {
        // notify all users with admin perms at the establishment
        return Profile.query().scopeToEstablishment('establishments.id', establishmentId, 'admin')
          .then(profiles => {
            profiles.map(profile => {
              if (taskHelper.isWithEstablishmentAdmin(task)) {
                recipients.set(profile.id, { email: 'task-action-required', profile });

              } else if (taskHelper.isNew(task)) {
                recipients.set(profile.id, { email: 'task-created', profile });

              } else if (taskHelper.isClosed(task)) {
                recipients.set(profile.id, { email: 'task-closed', profile });
              }
            });
          });
      }
    })
    .then(() => recipients);
};
