const assert = require('assert');
const dbHelper = require('../../../helpers/db');
const logger = require('../../../helpers/logger');
const Recipients = require('../../../../lib/recipients');
const { basic, croydonAdmin1, marvellAdmin } = require('../../../helpers/users');

const {
  projectTransferGranted,
  projectTransferSubmitted
} = require('../../../data/tasks');

describe('Project transfer', () => {

  before(() => {
    this.schema = dbHelper.init();
    this.recipientBuilder = Recipients({ schema: this.schema, logger });
  });

  beforeEach(() => {
    return dbHelper.reset(this.schema)
      .then(() => dbHelper.loadFixtures(this.schema))
      .then(() => {
        return this.schema.Project.query().insert(projectTransferSubmitted.data.modelData);
      });
  });

  after(() => {
    return this.schema.destroy();
  });

  it('notifies the licence holder when their project is transferred', () => {
    return this.recipientBuilder.getNotifications(projectTransferGranted)
      .then(recipients => {
        assert(recipients.has(basic), 'basic user is in the recipients list');
        assert.equal(recipients.get(basic).emailTemplate, 'licence-granted');
        assert.equal(recipients.get(basic).applicant.id, basic);
      });
  });

  it('notifies the new est admins when the project is transferred', () => {
    return this.recipientBuilder.getNotifications(projectTransferGranted)
      .then(recipients => {
        assert(recipients.has(marvellAdmin), 'Marvell admin is in the recipients list');
        assert.equal(recipients.get(basic).emailTemplate, 'licence-granted');
      });
  });

  it('notifies the outgoing establishment admins when the transfer is submitted', () => {
    return this.recipientBuilder.getNotifications(projectTransferSubmitted)
      .then(recipients => {
        assert(recipients.has(croydonAdmin1), 'Croydon admin is in recipients list');
        assert.equal(recipients.get(basic).emailTemplate, 'task-opened');
      });
  });

  it('doesn\'t notify the incoming admins when the transfer is submitted', () => {
    return this.recipientBuilder.getNotifications(projectTransferSubmitted)
      .then(recipients => {
        assert(!recipients.has(marvellAdmin), 'Marvell admin is not in recipients list');
        assert.equal(recipients.get(basic).emailTemplate, 'task-opened');
      });
  });

});
