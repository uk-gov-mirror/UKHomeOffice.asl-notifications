const { get } = require('lodash');

module.exports = task => {
  const model = get(task, 'data.model');
  const action = get(task, 'data.action');

  if (action === 'revoke') {
    return 'revocation';
  }

  if (action === 'transfer') {
    return 'transfer';
  }

  if (get(task, 'data.modelData.status') === 'active') {
    return 'amendment';
  }

  if (model === 'profile' && action === 'update') {
    return 'amendment';
  }

  if (['role', 'place'].includes(model) && ['create', 'delete'].includes(action)) {
    return 'amendment';
  }

  return 'application';
};
