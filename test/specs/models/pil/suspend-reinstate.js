const assert = require('assert');
const dbHelper = require('../../../helpers/db');
const logger = require('../../../helpers/logger');
const Recipients = require('../../../../lib/recipients');
const {
  croydonPilHolder1,
  croydonPilHolder2,
  croydonAdmin1,
  croydonAdmin2,
  croydonAdminUnsubscribed,
  croydonNtco
} = require('../../../helpers/users');

const { pilSuspended, pilReinstated } = require('../../../data/tasks');

describe('PIL', () => {

  before(() => {
    this.schema = dbHelper.init();
    this.recipientBuilder = Recipients({ schema: this.schema, logger });
  });

  beforeEach(() => {
    return dbHelper.reset(this.schema)
      .then(() => dbHelper.loadFixtures(this.schema))
      .then(() => {
        return this.schema.PIL.query().insert([
          {
            id: 'a5cd0eb3-1d00-4998-ab14-a67969a4e769',
            profileId: croydonPilHolder1,
            establishmentId: 8201,
            licenceNumber: 'CR-PILH-1',
            status: 'active'
          },
          {
            id: 'a331f266-84a2-40e5-9532-2b506f24f091',
            profileId: croydonPilHolder2,
            establishmentId: 8201,
            licenceNumber: 'CR-PILH-2',
            status: 'active'
          }
        ]);
      });
  });

  after(() => {
    return this.schema.destroy();
  });

  describe('Suspend', () => {

    it('notifies the licence holder, ntco and subscribed establishment admins when ASRU suspends a PIL', () => {
      return this.recipientBuilder.getNotifications(pilSuspended)
        .then(recipients => {
          assert(recipients.has(croydonPilHolder1), 'croydonPilHolder1 user is in the recipients list');
          assert.equal(recipients.get(croydonPilHolder1).emailTemplate, 'licence-suspended', 'email type is licence-suspended');

          assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
          assert.equal(recipients.get(croydonAdmin1).emailTemplate, 'licence-suspended', 'email type is licence-suspended');

          assert(recipients.has(croydonAdmin2), 'croydonAdmin2 is in the recipients list');
          assert.equal(recipients.get(croydonAdmin2).emailTemplate, 'licence-suspended', 'email type is licence-suspended');

          assert(recipients.has(croydonNtco), 'croydonNtco is in the recipients list');
          assert.equal(recipients.get(croydonNtco).emailTemplate, 'licence-suspended', 'email type is licence-suspended');

          assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
        });
    });

  });

  describe('Reinstate', () => {

    it('notifies the licence holder, ntco and subscribed establishment admins when ASRU reinstates a PIL', () => {
      return this.recipientBuilder.getNotifications(pilReinstated)
        .then(recipients => {
          assert(recipients.has(croydonPilHolder1), 'croydonPilHolder1 user is in the recipients list');
          assert.equal(recipients.get(croydonPilHolder1).emailTemplate, 'licence-reinstated', 'email type is licence-reinstated');

          assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
          assert.equal(recipients.get(croydonAdmin1).emailTemplate, 'licence-reinstated', 'email type is licence-reinstated');

          assert(recipients.has(croydonAdmin2), 'croydonAdmin2 is in the recipients list');
          assert.equal(recipients.get(croydonAdmin2).emailTemplate, 'licence-reinstated', 'email type is licence-reinstated');

          assert(recipients.has(croydonNtco), 'croydonNtco is in the recipients list');
          assert.equal(recipients.get(croydonNtco).emailTemplate, 'licence-reinstated', 'email type is licence-reinstated');

          assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
        });
    });

  });

});
