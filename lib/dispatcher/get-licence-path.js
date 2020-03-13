const { get } = require('lodash');

module.exports = task => {
  const model = get(task, 'data.model');
  const establishmentId = get(task, 'data.establishmentId');

  switch (model) {
    case 'place':
    case 'role':
    case 'establishment':
      return `establishments/${establishmentId}/details`;

    case 'project':
      const projectId = get(task, 'data.id');
      const versionId = get(task, 'data.data.version');
      return `establishments/${establishmentId}/projects/${projectId}/versions/${versionId}`;

    case 'pil':
      const profileId = get(task, 'data.subject');
      const pilId = get(task, 'data.id');
      return `establishments/${establishmentId}/people/${profileId}/pil/${pilId}`;
  }
};
