const { get } = require('lodash');
const taskHelper = require('../utils/task');

const builders = {
  establishment: require('./establishment'),
  project: require('./project')
};

module.exports = ({ schema, logger }) => ({
  getRecipientList: (task) => {
    if (taskHelper.ignore(task)) {
      logger.info(`ignoring task.status '${task.status}'`);
      return Promise.resolve(new Map());
    }

    const taskModel = get(task, 'data.model');

    if (!builders[taskModel]) {
      logger.info(`task has no model present`);
      return Promise.resolve(new Map());
    }

    return builders[taskModel]({ schema, logger, task });
  }
});
