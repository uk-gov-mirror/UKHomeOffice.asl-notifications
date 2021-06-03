const { get } = require('lodash');
const taskHelper = require('../utils/task');

module.exports = async ({ schema, logger, task }) => {
  logger.verbose('generating notifications for projectCollaborators task');

  const notifications = new Map();
  const action = get(task, 'data.action');
  const projectId = get(task, 'data.data.projectId');
  const profileId = get(task, 'data.data.profileId');

  const project = await schema.Project.query().findById(projectId);
  const licenceHolder = await schema.Profile.query().findById(project.licenceHolderId);
  const licenceNumber = project.licenceNumber;
  const projectTitle = project.title || 'Untitled project';

  if (taskHelper.isResolved(task)) {

    if (action === 'create') {
      const collaborator = await schema.Profile.query().findById(profileId);
      logger.verbose(`collaborator added, sending notifications to licence holder: ${licenceHolder.id}, and collaborator: ${collaborator.id}`);
      notifications.set(collaborator.id, {
        emailTemplate: 'collaborator-added',
        recipient: collaborator,
        projectTitle,
        subject: `Invitation to view a project ${licenceNumber}`
      });
      notifications.set(licenceHolder.id, {
        emailTemplate: 'collaborator-added',
        recipient: licenceHolder,
        projectTitle,
        isLicenceHolder: true,
        subject: `Access to a project granted ${licenceNumber}`
      });
    }

    if (action === 'delete') {
      logger.verbose(`collaborator removed, sending notification to licence holder: ${licenceHolder.id}`);
      notifications.set(licenceHolder.id, {
        emailTemplate: 'collaborator-removed',
        recipient: licenceHolder,
        projectTitle,
        subject: `Access to a project removed ${licenceNumber}`
      });
    }
  }

  return notifications;
};
