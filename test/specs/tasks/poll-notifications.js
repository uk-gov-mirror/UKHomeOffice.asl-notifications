const { v4: uuid } = require('uuid');
const sinon = require('sinon');
const moment = require('moment');
const assert = require('assert');
const dbHelper = require('../../helpers/db');
const logger = require('../../helpers/logger');
const poll = require('../../../jobs/poll-notifications');
const { basic } = require('../../helpers/users');

describe('Poll notifications', () => {

  before(() => {
    this.schema = dbHelper.init();
  });

  beforeEach(() => {
    this.sendEmail = sinon.stub();
    return dbHelper.reset(this.schema)
      .then(() => dbHelper.loadFixtures(this.schema));
  });

  after(() => {
    return this.schema.destroy();
  });

  it('calls sendEmail for each incomplete notification in the db, updating to complete', () => {
    const params = {
      profileId: basic,
      to: 'basic.user@example.com',
      name: 'Basic User',
      subject: 'Test',
      html: '<h1>test</h1>',
      identifier: uuid()
    };

    return Promise.resolve()
      .then(() => this.schema.Notification.query().insert(params))
      .then(() => poll({ sendEmail: this.sendEmail, schema: this.schema, logger }))
      .then(() => {
        assert.equal(this.sendEmail.called, true);
        assert.equal(this.sendEmail.callCount, 1);
      })
      .then(() => this.schema.Notification.query().findOne({ profileId: basic }))
      .then(notification => {
        assert.ok(this.sendEmail.calledWith(notification));
        assert.ok(notification.completed !== null);
      });
  });

  it('calls sendEmail for each incomplete notification in the db, updating to complete', () => {
    const params = [
      {
        profileId: basic,
        to: 'basic.user@example.com',
        name: 'Basic User',
        subject: 'Test',
        html: '<h1>test</h1>',
        identifier: uuid(),
        completed: moment().toISOString()
      },
      {
        profileId: basic,
        to: 'basic.user2@example.com',
        name: 'Basic User',
        subject: 'Test',
        html: '<h1>test</h1>',
        identifier: uuid()
      }
    ];

    return Promise.resolve()
      .then(() => this.schema.Notification.query().insert(params))
      .then(() => poll({ sendEmail: this.sendEmail, schema: this.schema, logger }))
      .then(() => {
        assert.equal(this.sendEmail.called, true);
        assert.equal(this.sendEmail.callCount, 1);
      })
      .then(() => this.schema.Notification.query().findOne({ to: 'basic.user2@example.com' }))
      .then(notification => {
        assert.ok(this.sendEmail.calledWith(notification));
      })
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        assert.equal(notifications.length, 2);
        notifications.map(notification => {
          assert.ok(notifications.completed !== null);
        });
      });
  });

});
