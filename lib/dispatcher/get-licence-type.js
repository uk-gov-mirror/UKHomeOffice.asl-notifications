const { get } = require('lodash');

module.exports = task => {
  let model = get(task, 'data.model');

  if (model === 'place' || model === 'role' || model === 'establishment') {
    return 'pel';
  }

  if (model === 'project') {
    return 'ppl';
  }

  return model;
};
