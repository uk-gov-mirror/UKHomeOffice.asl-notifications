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
    return dbHelper.reset(this.schema)
      .then(() => dbHelper.loadFixtures(this.schema));
  });

  after(() => {
    return this.schema.destroy();
  });

  it('returns empty if the event is a comment', () => {
    const task = { event: 'comment', status: 'with-inspectorate', model: 'project', action: 'grant' };

    return this.recipientBuilder.getNotifications(task)
      .then(recipients => {
        assert(isEmpty(recipients), 'do not notify users of comments');
      });
  });

  it('returns empty if the event is a comment edit', () => {
    const task = { event: 'edit-comment', status: 'with-inspectorate', model: 'project', action: 'grant' };

    return this.recipientBuilder.getNotifications(task)
      .then(recipients => {
        assert(isEmpty(recipients), 'do not notify users of comments');
      });
  });

  it('returns empty if the event is a comment deletion', () => {
    const task = { event: 'delete-comment', status: 'with-inspectorate', model: 'project', action: 'grant' };

    return this.recipientBuilder.getNotifications(task)
      .then(recipients => {
        assert(isEmpty(recipients), 'do not notify users of comments');
      });
  });

  it('returns empty if the task status is an ignored status', () => {
    const task = { event: 'status:returned-to-applicant:resubmitted', status: 'with-inspectorate', model: 'establishment', meta: { previous: 'returned-to-applicant', next: 'resubmitted' } };

    return this.recipientBuilder.getNotifications(task)
      .then(recipients => {
        assert(isEmpty(recipients), 'do not notify users of ignored task statuses');
      });
  });

  it('returns empty if there is no model present in the task', () => {
    const task = { event: 'status:returned-to-applicant:resubmitted', status: 'not-a-valid-task', model: null, meta: { previous: 'returned-to-applicant', next: 'resubmitted' } };

    return this.recipientBuilder.getNotifications(task)
      .then(recipients => {
        assert(isEmpty(recipients), 'do not notify users if we can\'t determine the model');
      });
  });

});
