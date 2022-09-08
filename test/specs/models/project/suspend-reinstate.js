const assert = require('assert');
const dbHelper = require('../../../helpers/db');
const logger = require('../../../helpers/logger');
const Recipients = require('../../../../lib/recipients');
const {
  croydonProjectHolder1,
  croydonProjectHolder2,
  croydonAdmin1,
  croydonAdmin2,
  croydonAdminUnsubscribed,
  collaborator,
  collaboratorUnsubscribed
} = require('../../../helpers/users');

const { projectSuspended, projectReinstated } = require('../../../data/tasks');

const projectId1 = '69c0d3c5-041a-4f6f-8677-60d4ddbc0997';
const projectId2 = 'f33c6e04-1a85-46e9-94e7-c7209313fea5';

describe('Project', () => {

  before(() => {
    this.schema = dbHelper.init();
    this.recipientBuilder = Recipients({ schema: this.schema, logger });
  });

  beforeEach(() => {
    return dbHelper.reset(this.schema)
      .then(() => dbHelper.loadFixtures(this.schema))
      .then(() => {
        return this.schema.Project.query().insert([
          {
            id: projectId1,
            licenceHolderId: croydonProjectHolder1,
            establishmentId: 8201,
            licenceNumber: 'CR-PPLH-1',
            status: 'active',
            schemaVersion: 1
          },
          {
            id: projectId2,
            licenceHolderId: croydonProjectHolder2,
            establishmentId: 8201,
            licenceNumber: 'CR-PPLH-2',
            status: 'active',
            schemaVersion: 1
          }
        ]);
      })
      .then(() => {
        return this.schema.ProjectProfile.query().insert([
          { projectId: projectId1, profileId: collaborator },
          { projectId: projectId1, profileId: collaboratorUnsubscribed }
        ]);
      });
  });

  after(() => {
    return this.schema.destroy();
  });

  describe('Suspend', () => {

    it('notifies the licence holder, project collaborators and subscribed establishment admins when ASRU suspends a project', () => {
      return this.recipientBuilder.getNotifications(projectSuspended)
        .then(recipients => {
          assert(recipients.has(croydonProjectHolder1), 'croydonProjectHolder1 user is in the recipients list');
          assert.equal(recipients.get(croydonProjectHolder1).emailTemplate, 'licence-suspended', 'email type is licence-suspended');

          assert(recipients.has(collaborator), 'collaborator is in the recipients list');
          assert(recipients.get(collaborator).emailTemplate === 'licence-suspended', 'email type is licence-suspended');
          assert(!recipients.has(collaboratorUnsubscribed), 'collaboratorUnsubscribed is not in the recipients list');

          assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
          assert.equal(recipients.get(croydonAdmin1).emailTemplate, 'licence-suspended', 'email type is licence-suspended');

          assert(recipients.has(croydonAdmin2), 'croydonAdmin2 is in the recipients list');
          assert.equal(recipients.get(croydonAdmin2).emailTemplate, 'licence-suspended', 'email type is licence-suspended');

          assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
        });
    });

  });

  describe('Reinstate', () => {

    it('notifies the licence holder, project collaborators and subscribed establishment admins when ASRU reinstates a project', () => {
      return this.recipientBuilder.getNotifications(projectReinstated)
        .then(recipients => {
          assert(recipients.has(croydonProjectHolder1), 'croydonProjectHolder1 user is in the recipients list');
          assert.equal(recipients.get(croydonProjectHolder1).emailTemplate, 'licence-reinstated', 'email type is licence-reinstated');

          assert(recipients.has(collaborator), 'collaborator is in the recipients list');
          assert(recipients.get(collaborator).emailTemplate === 'licence-reinstated', 'email type is licence-reinstated');
          assert(!recipients.has(collaboratorUnsubscribed), 'collaboratorUnsubscribed is not in the recipients list');

          assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
          assert.equal(recipients.get(croydonAdmin1).emailTemplate, 'licence-reinstated', 'email type is licence-reinstated');

          assert(recipients.has(croydonAdmin2), 'croydonAdmin2 is in the recipients list');
          assert.equal(recipients.get(croydonAdmin2).emailTemplate, 'licence-reinstated', 'email type is licence-reinstated');

          assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
        });
    });

  });

});
