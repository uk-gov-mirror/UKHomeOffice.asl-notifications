const { get } = require('lodash');

module.exports = async ({ schema, licenceType, task }) => {
  const { Project, Establishment, PIL } = schema;
  const establishmentId = get(task, 'data.establishmentId');
  const modelId = get(task, 'data.id');
  let model;

  switch (licenceType) {
    case 'pel':
      model = await Establishment.query().findById(establishmentId);
      break;

    case 'ppl':
      model = await Project.query().findById(modelId);
      break;

    case 'pil':
      model = await PIL.query().findById(modelId);
      break;
  }

  return model;
};
