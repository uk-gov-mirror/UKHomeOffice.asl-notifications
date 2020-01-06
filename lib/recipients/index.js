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
    const status = get(task, 'status');
    const model = get(task, 'data.model');
    const action = get(task, 'data.action');
    const isAutoresolvingProfileUpdate = status === 'autoresolved' && model === 'profile' && action === 'update';

    if (!event.match(/^status:/)) {
      logger.info(`ignoring non-status-change event '${task.event}'`);
      return Promise.resolve(new Map());
    }

    if (!isAutoresolvingProfileUpdate && taskHelper.ignore(task)) {
      logger.info(`ignoring task.status '${task.status}'`);
      return Promise.resolve(new Map());
    }

    if (!model || !builders[model]) {
      logger.info(`recipient list could not be determined for model '${model}'`);
      return Promise.resolve(new Map());
    }

    return builders[model]({ schema, logger, task });
  }
});
