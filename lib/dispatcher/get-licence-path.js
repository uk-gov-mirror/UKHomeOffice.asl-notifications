const { get } = require('lodash');

module.exports = (task, notification = {}) => {
  const model = get(task, 'data.model');
  const establishmentId = notification.establishmentId || get(task, 'data.establishmentId');
  let projectId;

  switch (model) {
    case 'place':
      return `establishments/${establishmentId}/places`;

    case 'role':
      return `establishments/${establishmentId}/people`;

    case 'establishment':
      return `establishments/${establishmentId}/details`;

    case 'project':
      projectId = get(task, 'data.id');
      return `establishments/${establishmentId}/projects/${projectId}`;

    case 'projectProfile':
      projectId = get(task, 'data.data.projectId');
      return `establishments/${establishmentId}/projects/${projectId}`;

    case 'pil':
      const profileId = get(task, 'data.subject');
      return `establishments/${establishmentId}/people/${profileId}/pil`;
  }
};
