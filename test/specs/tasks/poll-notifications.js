const uuid = require('uuid');
const sinon = require('sinon');
const moment = require('moment');
const assert = require('assert');
const dbHelper = require('../../helpers/db');
const logger = require('../../helpers/logger');
const poll = require('../../../tasks/poll-notifications');

describe('Poll notifications', () => {

  before(() => {
    this.schema = dbHelper.init();
  });

  beforeEach(() => {
    this.sendEmail = sinon.stub();
    return dbHelper.reset()
      .then(() => dbHelper.loadFixtures(this.schema));
  });

  after(() => {
    return this.schema.destroy();
  });

  it('calls sendEmail for each incomplete notification in the db, updating to complete', () => {
    const params = {
      to: 'test@test.com',
      name: 'Testy McTestface',
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
      .then(() => this.schema.Notification.query().findOne('to', 'test@test.com'))
      .then(notification => {
        assert.ok(this.sendEmail.calledWith(notification));
        assert.ok(notification.completed !== null);
      });
  });

  it('calls sendEmail for each incomplete notification in the db, updating to complete', () => {
    const params = [
      {
        to: 'test@test.com',
        name: 'Testy McTestface',
        subject: 'Test',
        html: '<h1>test</h1>',
        identifier: uuid(),
        completed: moment().toISOString()
      },
      {
        to: 'test2@test.com',
        name: 'Testy2 McTestface',
        subject: 'Test2',
        html: '<h1>test2</h1>',
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
      .then(() => this.schema.Notification.query().findOne({ to: 'test2@test.com' }))
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
