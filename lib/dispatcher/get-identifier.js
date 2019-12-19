const { get } = require('lodash');

module.exports = ({ task, model, applicant }) => {
  switch (model) {
    case 'profile':
    case 'pil':
      return `${applicant.firstName} ${applicant.lastName}`;

    case 'pel':
      return get(task, 'data.modelData.name');

    case 'ppl':
      return get(task, 'data.modelData.title');
  }
  return '';
};
