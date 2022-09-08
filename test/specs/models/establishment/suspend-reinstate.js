const assert = require('assert');
const dbHelper = require('../../../helpers/db');
const logger = require('../../../helpers/logger');
const Recipients = require('../../../../lib/recipients');
const {
  croydonAdmin1,
  croydonAdmin2,
  croydonAdminUnsubscribed,
  croydonPilHolder1,
  croydonPilHolder2,
  croydonProjectHolder1,
  croydonProjectHolder2
} = require('../../../helpers/users');

const { pelSuspended, pelReinstated } = require('../../../data/tasks');

describe('PEL', () => {

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
      })
      .then(() => {
        return this.schema.Project.query().insert([
          {
            id: '69c0d3c5-041a-4f6f-8677-60d4ddbc0997',
            licenceHolderId: croydonProjectHolder1,
            establishmentId: 8201,
            licenceNumber: 'CR-PPLH-1',
            status: 'active',
            schemaVersion: 1
          },
          {
            id: 'f33c6e04-1a85-46e9-94e7-c7209313fea5',
            licenceHolderId: croydonProjectHolder2,
            establishmentId: 8201,
            licenceNumber: 'CR-PPLH-2',
            status: 'active',
            schemaVersion: 1
          }
        ]);
      });
  });

  after(() => {
    return this.schema.destroy();
  });

  describe('Suspend', () => {

    it('notifies all admins at the establishment when the establishment is suspended', () => {
      return this.recipientBuilder.getNotifications(pelSuspended)
        .then(recipients => {
          assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
          assert(recipients.get(croydonAdmin1).emailTemplate === 'licence-suspended', 'email type is licence-suspended');
          assert(recipients.has(croydonAdmin2), 'croydonAdmin2 is in the recipients list');
          // email preferences are ignored for PEL suspension
          assert(recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is still in the recipients list');
        });
    });

    it('notifies all PIL holders at the establishment when the establishment is suspended', () => {
      return this.recipientBuilder.getNotifications(pelSuspended)
        .then(recipients => {
          assert(recipients.has(croydonPilHolder1), 'croydonPilHolder1 is in the recipients list');
          assert(recipients.get(croydonPilHolder1).emailTemplate === 'licence-suspended', 'email type is licence-suspended');
          assert(recipients.has(croydonPilHolder2), 'croydonPilHolder2 is in the recipients list');
        });
    });

    it('notifies all project licence holders at the establishment when the establishment is suspended', () => {
      return this.recipientBuilder.getNotifications(pelSuspended)
        .then(recipients => {
          assert(recipients.has(croydonProjectHolder1), 'croydonProjectHolder1 is in the recipients list');
          assert(recipients.get(croydonProjectHolder1).emailTemplate === 'licence-suspended', 'email type is licence-suspended');
          assert(recipients.has(croydonProjectHolder2), 'croydonProjectHolder2 is in the recipients list');
        });
    });

  });

  describe('Reinstate', () => {

    it('notifies all admins at the establishment when the establishment is reinstated', () => {
      return this.recipientBuilder.getNotifications(pelReinstated)
        .then(recipients => {
          assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
          assert(recipients.get(croydonAdmin1).emailTemplate === 'licence-reinstated', 'email type is licence-suspended');
          assert(recipients.has(croydonAdmin2), 'croydonAdmin2 is in the recipients list');
          // email preferences are ignored for PEL suspension
          assert(recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is still in the recipients list');
        });
    });

    it('notifies all PIL holders at the establishment when the establishment is reinstated', () => {
      return this.recipientBuilder.getNotifications(pelReinstated)
        .then(recipients => {
          assert(recipients.has(croydonPilHolder1), 'croydonPilHolder1 is in the recipients list');
          assert(recipients.get(croydonPilHolder1).emailTemplate === 'licence-reinstated', 'email type is licence-suspended');
          assert(recipients.has(croydonPilHolder2), 'croydonPilHolder2 is in the recipients list');
        });
    });

    it('notifies all project licence holders at the establishment when the establishment is reinstated', () => {
      return this.recipientBuilder.getNotifications(pelReinstated)
        .then(recipients => {
          assert(recipients.has(croydonProjectHolder1), 'croydonProjectHolder1 is in the recipients list');
          assert(recipients.get(croydonProjectHolder1).emailTemplate === 'licence-reinstated', 'email type is licence-suspended');
          assert(recipients.has(croydonProjectHolder2), 'croydonProjectHolder2 is in the recipients list');
        });
    });

  });

});
