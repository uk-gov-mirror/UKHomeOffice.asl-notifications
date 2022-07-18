const { v4: uuid } = require('uuid');
const assert = require('assert');
const dbHelper = require('../../helpers/db');
const logger = require('../../helpers/logger');
const Notifier = require('../../../lib/utils/notifier');
const { basic, croydonAdmin1 } = require('../../helpers/users');

describe('Notifier', () => {

  before(() => {
    this.schema = dbHelper.init();
    this.notifier = Notifier({ schema: this.schema, logger });
  });

  beforeEach(() => {
    return dbHelper.reset(this.schema)
      .then(() => dbHelper.loadFixtures(this.schema));
  });

  after(() => {
    return this.schema.destroy();
  });

  it('adds a notification to the DB', () => {
    const params = {
      profileId: basic,
      to: 'test@test.com',
      name: 'Testy McTestface',
      subject: 'Test',
      html: '<h1>test</h1>',
      identifier: uuid()
    };

    return Promise.resolve()
      .then(() => this.notifier(params))
      .then(() => this.schema.Notification.query().findOne({ profileId: basic }))
      .then(notification => {
        assert.ok(notification);
        assert.equal(notification.html, params.html);
        assert.equal(notification.completed, null);
      });
  });

  it('doesn\'t add a notification to the DB if identifier already exists for user', () => {
    const params = {
      profileId: basic,
      to: 'test@test.com',
      name: 'Testy McTestface',
      subject: 'Test',
      html: '<h1>test</h1>',
      identifier: uuid()
    };

    return Promise.resolve()
      .then(() => this.schema.Notification.query().insert(params))
      .then(() => this.notifier(params))
      .then(() => this.schema.Notification.query().where({ identifier: params.identifier }))
      .then(notifications => {
        assert.equal(notifications.length, 1);
      });
  });

  it('adds a notification to the DB if identifier already but for different user', () => {
    const identifier = uuid();
    const user1 = {
      profileId: basic,
      to: 'test@test.com',
      name: 'Testy McTestface',
      subject: 'Test',
      html: '<h1>test</h1>',
      identifier
    };

    const user2 = {
      profileId: croydonAdmin1,
      to: 'croy@admin.com',
      name: 'Testy McTestface',
      subject: 'Test',
      html: '<h1>test</h1>',
      identifier
    };

    return Promise.resolve()
      .then(() => this.schema.Notification.query().insert(user1))
      .then(() => this.notifier(user2))
      .then(() => this.schema.Notification.query().where({ identifier }))
      .then(notifications => {
        assert.equal(notifications.length, 2);
      });
  });
});
