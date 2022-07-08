const assert = require('assert');
const dbHelper = require('../helpers/db');
const logger = require('../helpers/logger');
const Emailer = require('../../lib/emailer');
const { basic } = require('../helpers/users');
const { projectApplicationSubmitted } = require('../data/tasks');

const publicUrl = 'http://localhost:8080';

describe('Emailer', () => {

  before(() => {
    this.schema = dbHelper.init();
    this.emailer = Emailer({ publicUrl, schema: this.schema, logger });
  });

  beforeEach(() => {
    return dbHelper.reset(this.schema)
      .then(() => dbHelper.loadFixtures(this.schema))
      .then(() => this.schema.Project.query().insert({
        id: '44ca3d4b-dedf-43e1-a6b7-12eb3cfb249b',
        title: 'My first project',
        status: 'inactive',
        createdAt: '2019-12-12T15:20:00.251Z',
        updatedAt: '2019-12-12T15:20:32.191Z',
        licenceNumber: 'TEST-PPL-APPLICATION',
        schemaVersion: 1,
        establishmentId: 8201,
        licenceHolderId: basic
      }));
  });

  after(() => {
    return this.schema.destroy();
  });

  it('adds a notification to the DB for each receipient', () => {
    return Promise.resolve()
      .then(() => this.emailer(projectApplicationSubmitted))
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        const expected = [
          'basic.user@example.com',
          'vice-chancellor@example.com',
          'croydon.admin@example.com'
        ];
        assert.equal(notifications.length, 3);
        assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
      });
  });

});
