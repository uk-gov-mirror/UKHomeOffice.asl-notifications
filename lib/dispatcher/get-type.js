const { get } = require('lodash');

module.exports = task => {
  const action = get(task, 'data.action');

  if (action === 'revoke') {
    return 'revocation';
  }

  if (action === 'transfer') {
    return 'transfer';
  }

  if (get(task, 'modelData.status') === 'active') {
    return 'amendment';
  }

  return 'application';
};
