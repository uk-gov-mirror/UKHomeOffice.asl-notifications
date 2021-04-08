const sinon = require('sinon');
const moment = require('moment');
const assert = require('assert');
const dbHelper = require('../../helpers/db');
const logger = require('../../helpers/logger');
const expiryNotice = require('../../../tasks/project-expiry-notice');
const { basic } = require('../../helpers/users');

const publicUrl = 'http://localhost:8080';

describe('Project expiry', () => {

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

  it('adds 6 month notification for each project due to expire in 6 months', () => {
    const projects = [
      {
        licenceHolderId: basic,
        expiryDate: moment().add(6, 'months').toISOString(),
        status: 'active',
        establishmentId: 8201
      }
    ];

    return Promise.resolve()
      .then(() => this.schema.Project.query().insert(projects))
      .then(() => expiryNotice({ schema: this.schema, logger, publicUrl }))
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
