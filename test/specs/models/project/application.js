const assert = require('assert');
const dbHelper = require('../../../helpers/db');
const logger = require('../../../helpers/logger');
const Recipients = require('../../../../lib/recipients');
const {
  basic,
  croydonAdmin1,
  croydonAdmin2,
  croydonAdminUnsubscribed,
  collaborator,
  collaboratorUnaffiliated,
  collaboratorUnsubscribed
} = require('../../../helpers/users');

const {
  projectApplicationSubmitted,
  projectApplicationEndorsed,
  projectApplicationApproved,
  projectApplicationGranted,
  projectApplicationRejected
} = require('../../../data/tasks');

describe('Project applications', () => {

  before(() => {
    this.schema = dbHelper.init();
    this.recipientBuilder = Recipients({ schema: this.schema, logger });
  });

  beforeEach(() => {
    return dbHelper.reset(this.schema)
      .then(() => dbHelper.loadFixtures(this.schema))
      .then(() => {
        return this.schema.Project.query().insert({
          id: '44ca3d4b-dedf-43e1-a6b7-12eb3cfb249b',
          title: 'My first project',
          status: 'inactive',
          createdAt: '2019-12-12T15:20:00.251Z',
          updatedAt: '2019-12-12T15:20:32.191Z',
          licenceNumber: 'TEST-PPL-APPLICATION',
          schemaVersion: 1,
          establishmentId: 8201,
          licenceHolderId: basic
        });
      })
      .then(project => {
        return this.schema.ProjectProfile.query().insert([
          { projectId: project.id, profileId: collaborator },
          { projectId: project.id, profileId: collaboratorUnsubscribed }
        ]);
      });
  });

  after(() => {
    return this.schema.destroy();
  });

  describe('Applicant', () => {

    it('notifies the applicant when a new application is submitted', () => {
      return this.recipientBuilder.getNotifications(projectApplicationSubmitted)
        .then(recipients => {
          assert(recipients.has(basic), 'basic user is in the recipients list');
          assert(recipients.get(basic).emailTemplate === 'task-opened', 'email type is task-opened');
          assert(recipients.get(basic).applicant.id === basic, 'basic user is the applicant');
        });
    });

    it('notifies the applicant when the application lands with ASRU', () => {
      return this.recipientBuilder.getNotifications(projectApplicationEndorsed)
        .then(recipients => {
          assert(recipients.has(basic), 'basic user is in the recipients list');
          assert(recipients.get(basic).emailTemplate === 'task-with-asru', 'email type is task-with-asru');
          assert(recipients.get(basic).applicant.id === basic, 'basic user is the applicant');
        });
    });

    it('does not notify the applicant when moving between inspectors and licensing', () => {
      return this.recipientBuilder.getNotifications(projectApplicationApproved)
        .then(recipients => {
          assert(!recipients.has(basic), 'basic user is not in the recipients list');
        });
    });

    it('notifies the applicant when the application is granted', () => {
      return this.recipientBuilder.getNotifications(projectApplicationGranted)
        .then(recipients => {
          assert(recipients.has(basic), 'basic user is in the recipients list');
          assert(recipients.get(basic).emailTemplate === 'licence-granted', 'email type is licence-granted');
          assert(recipients.get(basic).applicant.id === basic, 'basic user is the applicant');
        });
    });

    it('notifies the applicant when the application is rejected', () => {
      return this.recipientBuilder.getNotifications(projectApplicationRejected)
        .then(recipients => {
          assert(recipients.has(basic), 'basic user is in the recipients list');
          assert(recipients.get(basic).emailTemplate === 'task-closed', 'email type is task-closed');
          assert(recipients.get(basic).applicant.id === basic, 'basic user is the applicant');
        });
    });

  });

  describe('Establishment admins', () => {

    it('notifies all subscribed admins at the establishment when a new application is submitted', () => {
      return this.recipientBuilder.getNotifications(projectApplicationSubmitted)
        .then(recipients => {
          assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
          assert(recipients.get(croydonAdmin1).emailTemplate === 'task-action-required', 'email type is task-action-required');
          assert(recipients.get(croydonAdmin1).applicant.id === basic, 'basic user is the applicant');
          assert(recipients.has(croydonAdmin2), 'croydonAdmin2 is in the recipients list');
          assert(recipients.get(croydonAdmin2).emailTemplate === 'task-action-required', 'email type is task-action-required');
          assert(recipients.get(croydonAdmin2).applicant.id === basic, 'basic user is the applicant');
          assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
        });
    });

    it('does not notify any admins at the establishment when an application lands with ASRU', () => {
      return this.recipientBuilder.getNotifications(projectApplicationEndorsed)
        .then(recipients => {
          assert(!recipients.has(croydonAdmin1), 'croydonAdmin1 is not in the recipients list');
          assert(!recipients.has(croydonAdmin2), 'croydonAdmin2 is not in the recipients list');
          assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
        });
    });

    it('does not notify any admins at the establishment when moving between inspectors and licensing', () => {
      return this.recipientBuilder.getNotifications(projectApplicationApproved)
        .then(recipients => {
          assert(!recipients.has(croydonAdmin1), 'croydonAdmin1 is not in the recipients list');
          assert(!recipients.has(croydonAdmin2), 'croydonAdmin2 is not in the recipients list');
          assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
        });
    });

    it('notifies all subscribed admins at the establishment when the application is granted', () => {
      return this.recipientBuilder.getNotifications(projectApplicationGranted)
        .then(recipients => {
          assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
          assert(recipients.get(croydonAdmin1).emailTemplate === 'licence-granted', 'email type is licence-granted');
          assert(recipients.get(croydonAdmin1).applicant.id === basic, 'basic user is the applicant');
          assert(recipients.has(croydonAdmin2), 'croydonAdmin2 is in the recipients list');
          assert(recipients.get(croydonAdmin2).emailTemplate === 'licence-granted', 'email type is licence-granted');
          assert(recipients.get(croydonAdmin2).applicant.id === basic, 'basic user is the applicant');
          assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
        });
    });

    it('notifies all subscribed admins at the establishment when the application is rejected', () => {
      return this.recipientBuilder.getNotifications(projectApplicationRejected)
        .then(recipients => {
          assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
          assert(recipients.get(croydonAdmin1).emailTemplate === 'task-closed', 'email type is task-closed');
          assert(recipients.get(croydonAdmin1).applicant.id === basic, 'basic user is the applicant');
          assert(recipients.has(croydonAdmin2), 'croydonAdmin2 is in the recipients list');
          assert(recipients.get(croydonAdmin2).emailTemplate === 'task-closed', 'email type is task-closed');
          assert(recipients.get(croydonAdmin2).applicant.id === basic, 'basic user is the applicant');
          assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
        });
    });

  });

  describe('Project collaborators', () => {

    it('notifies all subscribed collaborators when the application is granted', () => {
      return this.recipientBuilder.getNotifications(projectApplicationGranted)
        .then(recipients => {
          assert(recipients.has(collaborator), 'collaborator is in the recipients list');
          assert(recipients.get(collaborator).emailTemplate === 'licence-granted', 'email type is licence-granted');
          assert(recipients.get(collaborator).applicant.id === basic, 'basic user is the applicant');
          assert(!recipients.has(collaboratorUnsubscribed), 'collaboratorUnsubscribed is not in the recipients list');
        });
    });

    it('does not notify collaborators if they have been removed from an establishment', () => {
      return this.recipientBuilder.getNotifications(projectApplicationGranted)
        .then(recipients => {
          assert(!recipients.has(collaboratorUnaffiliated), 'collaboratorUnaffiliated should not be in the recipients list');
        });
    });

  });

});
