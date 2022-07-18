const assert = require('assert');
const { get } = require('lodash');

module.exports = (task, notification = {}) => {
  const model = get(task, 'data.model');
  const establishmentId = notification.establishmentId || get(task, 'data.establishmentId');
  let projectId;

  assert.ok(establishmentId, 'Establishment id must be defined');

  switch (model) {
    case 'place':
      return `establishments/${establishmentId}/places`;

    case 'role':
      return `establishments/${establishmentId}/people`;

    case 'establishment':
      return `establishments/${establishmentId}/details`;

    case 'project':
      projectId = get(task, 'data.id');
      assert.ok(projectId, 'Project id must be defined');
      return `establishments/${establishmentId}/projects/${projectId}`;

    case 'projectProfile':
      projectId = get(task, 'data.data.projectId');
      assert.ok(projectId, 'Project id must be defined');
      return `establishments/${establishmentId}/projects/${projectId}`;

    case 'pil':
    case 'trainingPil':
      const profileId = get(task, 'data.subject') || get(notification, 'licenceHolderId');
      assert.ok(profileId, 'Profile id must be defined');
      return `establishments/${establishmentId}/people/${profileId}/pil`;
  }
};
