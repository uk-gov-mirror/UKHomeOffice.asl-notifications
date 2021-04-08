const { pick } = require('lodash');
const fetch = require('r2');

module.exports = ({ emailServiceHost }) => notification => {
  const params = {
    method: 'POST',
    json: pick(notification, 'to', 'name', 'subject', 'html')
  };
  return fetch(`${emailServiceHost}/custom`, params).response;
};
