const assert = require('assert');
const dbHelper = require('../../../helpers/db');
const logger = require('../../../helpers/logger');
const Recipients = require('../../../../lib/recipients');
const { basic, holc, croydonAdmin } = require('../../../helpers/users');

const {
  projectApplicationSubmitted,
  projectApplicationEndorsed,
  projectApplicationApproved,
  projectApplicationGranted
} = require('../../../data/tasks');

describe('Project applications', () => {

  before(() => {
    this.schema = dbHelper.init();
    this.recipientBuilder = Recipients({ schema: this.schema, logger });
  });

  beforeEach(() => {
    return dbHelper.reset()
      .then(() => dbHelper.loadFixtures(this.schema));
  });

  after(() => {
    return this.schema.destroy();
  });

  describe('applicant', () => {

    it('notifies the applicant when a new application is submitted', () => {
      return this.recipientBuilder.getRecipientList(projectApplicationSubmitted)
        .then(recipients => {
          assert(recipients.has(basic), 'basic user is in the recipients list');
          assert(recipients.get(basic).email === 'task-created', 'email type is task-created');
        });
    });

    it('notifies the applicant when the application lands with ASRU', () => {
      return this.recipientBuilder.getRecipientList(projectApplicationEndorsed)
        .then(recipients => {
          assert(recipients.has(basic), 'basic user is in the recipients list');
          assert(recipients.get(basic).email === 'task-with-asru', 'email type is task-with-asru');
        });
    });

    it('does not notify the applicant when moving between inspectors and licensing', () => {
      return this.recipientBuilder.getRecipientList(projectApplicationApproved)
        .then(recipients => {
          assert(!recipients.has(basic), 'basic user is not in the recipients list');
        });
    });

    it('notifies the applicant when the application is granted', () => {
      return this.recipientBuilder.getRecipientList(projectApplicationGranted)
        .then(recipients => {
          assert(recipients.has(basic), 'basic user is in the recipients list');
          assert(recipients.get(basic).email === 'task-closed', 'email type is task-closed');
        });
    });

  });

  describe('admins', () => {

    it('notifies all admins at the establishment when a new application is submitted', () => {
      return this.recipientBuilder.getRecipientList(projectApplicationSubmitted)
        .then(recipients => {
          assert(recipients.has(holc), 'holc is in the recipients list');
          assert(recipients.get(holc).email === 'task-action-required', 'email type is task-action-required');
          assert(recipients.has(croydonAdmin), 'croydonAdmin is in the recipients list');
          assert(recipients.get(croydonAdmin).email === 'task-action-required', 'email type is task-action-required');
        });
    });

    it('does not notify any admins at the establishment when an application lands with ASRU', () => {
      return this.recipientBuilder.getRecipientList(projectApplicationEndorsed)
        .then(recipients => {
          assert(!recipients.has(holc), 'holc is not in the recipients list');
          assert(!recipients.has(croydonAdmin), 'croydonAdmin is not in the recipients list');
        });
    });

    it('does not notify any admins at the establishment when moving between inspectors and licensing', () => {
      return this.recipientBuilder.getRecipientList(projectApplicationApproved)
        .then(recipients => {
          assert(!recipients.has(holc), 'holc is not in the recipients list');
          assert(!recipients.has(croydonAdmin), 'croydonAdmin is not in the recipients list');
        });
    });

    it('notifies all admins at the establishment when the application is granted', () => {
      return this.recipientBuilder.getRecipientList(projectApplicationGranted)
        .then(recipients => {
          assert(recipients.has(holc), 'holc is in the recipients list');
          assert(recipients.get(holc).email === 'task-closed', 'email type is task-closed');
          assert(recipients.has(croydonAdmin), 'croydonAdmin is in the recipients list');
          assert(recipients.get(croydonAdmin).email === 'task-closed', 'email type is task-closed');
        });
    });

  });

});
