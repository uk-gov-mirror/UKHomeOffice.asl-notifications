const { get } = require('lodash');

module.exports = task => {
  const model = get(task, 'data.model');
  const action = get(task, 'data.action');

  if (model === 'project' && action === 'grant-ra') {
    return 'ra';
  }

  if (action === 'revoke') {
    return 'revocation';
  }

  if (action === 'suspend') {
    return 'suspension';
  }

  if (action === 'reinstate') {
    return 'reinstatement';
  }

  if (['transfer', 'review'].includes(action)) {
    return action;
  }

  if (get(task, 'data.modelData.status') === 'active') {
    return 'amendment';
  }

  if (model === 'profile' && action === 'update') {
    return 'amendment';
  }

  if (['role', 'place'].includes(model)) {
    return 'amendment';
  }

  return 'application';
};
