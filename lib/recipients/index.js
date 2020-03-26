const { get } = require('lodash');
const taskHelper = require('../utils/task');

const builders = {
  establishment: require('./establishment'),
  place: require('./establishment'),
  role: require('./establishment'),
  profile: require('./profile'),
  pil: require('./pil'),
  project: require('./project')
};

module.exports = ({ schema, logger }) => ({
  getNotifications: (task) => {
    const event = get(task, 'event');
    const model = get(task, 'data.model');

    if (!event.match(/^status:/)) {
      logger.info(`ignoring non-status-change event '${task.event}'`);
      return Promise.resolve(new Map());
    }

    if (taskHelper.isIgnoredStatus(task)) {
      logger.info(`ignoring task.status '${task.status}'`);
      return Promise.resolve(new Map());
    }

    if (['exemption', 'certificate', 'invitation'].includes(model)) {
      logger.info(`ignoring model '${model}'`);
      return Promise.resolve(new Map());
    }

    if (!model || !builders[model]) {
      logger.error(`recipient list could not be determined for model '${model}'`);
      return Promise.resolve(new Map());
    }

    return builders[model]({ schema, logger, task });
  }
});
