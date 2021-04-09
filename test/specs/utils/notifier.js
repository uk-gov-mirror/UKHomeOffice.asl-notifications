const uuid = require('uuid');
const assert = require('assert');
const dbHelper = require('../../helpers/db');
const logger = require('../../helpers/logger');
const Notifier = require('../../../lib/utils/notifier');

describe('Notifier', () => {

  before(() => {
    this.schema = dbHelper.init();
    this.notifier = Notifier({ schema: this.schema, logger });
  });

  beforeEach(() => {
    return dbHelper.reset()
      .then(() => dbHelper.loadFixtures(this.schema));
  });

  after(() => {
    return this.schema.destroy();
  });

  it('adds a notification to the DB', () => {
    const params = {
      to: 'test@test.com',
      name: 'Testy McTestface',
      subject: 'Test',
      html: '<h1>test</h1>',
      identifier: uuid()
    };

    return Promise.resolve()
      .then(() => this.notifier(params))
      .then(() => this.schema.Notification.query().findOne('to', 'test@test.com'))
      .then(notification => {
        assert.ok(notification);
        assert.equal(notification.html, params.html);
        assert.equal(notification.completed, null);
      });
  });

  it('doesn\'t add a notification to the DB if identifier already exists', () => {
    const params = {
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
});
