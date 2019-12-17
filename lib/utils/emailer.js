const fetch = require('r2');

module.exports = (emailServiceHost, logger) => async (path, params) => {
  try {
    return await fetch(`${emailServiceHost}${path}`, params).response;
  } catch (e) {
    logger.error(e.message);
  }
};
