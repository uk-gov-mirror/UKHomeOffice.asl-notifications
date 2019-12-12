const assert = require('assert');
const { isEmpty } = require('lodash');
const dbHelper = require('../helpers/db');
const logger = require('../helpers/logger');
const Recipients = require('../../lib/recipients');

describe('Notification list', () => {

  before(() => {
    this.schema = dbHelper.init();
    this.recipientBuilder = Recipients({ schema: this.schema, logger });
  });

  beforeEach(() => {
    return dbHelper.reset()
      .then(() => dbHelper.loadFixtures(this.schema));
  });

  after(() => {
    return this.schema.destroy();
  });

  it('returns empty if the task status is an ignored status', () => {
    const task = { status: 'resubmitted', model: 'establishment' };

    return this.recipientBuilder.getRecipientList(task)
      .then(recipients => {
        assert(isEmpty(recipients), 'do not notify users of ignored task statuses');
      });
  });

  it('returns empty if there is no model present in the task', () => {
    const task = { status: 'not-a-valid-task', model: null };

    return this.recipientBuilder.getRecipientList(task)
      .then(recipients => {
        assert(isEmpty(recipients), 'do not notify users if we can\'t determine the model');
      });
  });

});
