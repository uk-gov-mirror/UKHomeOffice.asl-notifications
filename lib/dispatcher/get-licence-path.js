const { get } = require('lodash');

module.exports = task => {
  const model = get(task, 'data.model');
  const establishmentId = get(task, 'data.establishmentId');

  switch (model) {
    case 'place':
      return `establishments/${establishmentId}/places`;

    case 'role':
      return `establishments/${establishmentId}/people`;

    case 'establishment':
      return `establishments/${establishmentId}/details`;

    case 'project':
      const projectId = get(task, 'data.id');
      return `establishments/${establishmentId}/projects/${projectId}`;

    case 'pil':
      const profileId = get(task, 'data.subject');
      const pilId = get(task, 'data.id');
      return `establishments/${establishmentId}/people/${profileId}/pil/${pilId}`;
  }
};
