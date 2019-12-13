const assert = require('assert');
const dbHelper = require('../../../helpers/db');
const logger = require('../../../helpers/logger');
const Recipients = require('../../../../lib/recipients');
const { basic, holc, croydonAdmin } = require('../../../helpers/users');

const {
  pilApplicationSubmitted,
  pilApplicationEndorsed,
  pilApplicationApproved,
  pilApplicationGranted,
  pilApplicationRejected
} = require('../../../data/tasks');

describe('PIL applications', () => {

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

  describe('Applicant', () => {

    it('notifies the applicant when a new application is submitted', () => {
      return this.recipientBuilder.getNotifications(pilApplicationSubmitted)
        .then(recipients => {
          assert(recipients.has(basic), 'basic user is in the recipients list');
          assert(recipients.get(basic).emailTemplate === 'task-opened', 'email type is task-opened');
          assert(recipients.get(basic).applicant.id === basic, 'basic user is the applicant');
        });
    });

    it('notifies the applicant when the application lands with ASRU', () => {
      return this.recipientBuilder.getNotifications(pilApplicationEndorsed)
        .then(recipients => {
          assert(recipients.has(basic), 'basic user is in the recipients list');
          assert(recipients.get(basic).emailTemplate === 'task-with-asru', 'email type is task-with-asru');
          assert(recipients.get(basic).applicant.id === basic, 'basic user is the applicant');
        });
    });

    it('does not notify the applicant when moving between inspectors and licensing', () => {
      return this.recipientBuilder.getNotifications(pilApplicationApproved)
        .then(recipients => {
          assert(!recipients.has(basic), 'basic user is not in the recipients list');
        });
    });

    it('notifies the applicant when the application is granted', () => {
      return this.recipientBuilder.getNotifications(pilApplicationGranted)
        .then(recipients => {
          assert(recipients.has(basic), 'basic user is in the recipients list');
          assert(recipients.get(basic).emailTemplate === 'task-closed', 'email type is task-closed');
          assert(recipients.get(basic).applicant.id === basic, 'basic user is the applicant');
        });
    });

    it('notifies the applicant when the application is rejected', () => {
      return this.recipientBuilder.getNotifications(pilApplicationRejected)
        .then(recipients => {
          assert(recipients.has(basic), 'basic user is in the recipients list');
          assert(recipients.get(basic).emailTemplate === 'task-closed', 'email type is task-closed');
          assert(recipients.get(basic).applicant.id === basic, 'basic user is the applicant');
        });
    });

  });

  describe('Establishment admins', () => {

    it('notifies all admins at the establishment when a new application is submitted', () => {
      return this.recipientBuilder.getNotifications(pilApplicationSubmitted)
        .then(recipients => {
          assert(recipients.has(holc), 'holc is in the recipients list');
          assert(recipients.get(holc).emailTemplate === 'task-opened', 'email type is task-opened');
          assert(recipients.get(holc).applicant.id === basic, 'basic user is the applicant');
          assert(recipients.has(croydonAdmin), 'croydonAdmin is in the recipients list');
          assert(recipients.get(croydonAdmin).emailTemplate === 'task-opened', 'email type is task-opened');
          assert(recipients.get(croydonAdmin).applicant.id === basic, 'basic user is the applicant');
        });
    });

    it('does not notify any admins at the establishment when an application lands with ASRU', () => {
      return this.recipientBuilder.getNotifications(pilApplicationEndorsed)
        .then(recipients => {
          assert(!recipients.has(holc), 'holc is not in the recipients list');
          assert(!recipients.has(croydonAdmin), 'croydonAdmin is not in the recipients list');
        });
    });

    it('does not notify any admins at the establishment when moving between inspectors and licensing', () => {
      return this.recipientBuilder.getNotifications(pilApplicationApproved)
        .then(recipients => {
          assert(!recipients.has(holc), 'holc is not in the recipients list');
          assert(!recipients.has(croydonAdmin), 'croydonAdmin is not in the recipients list');
        });
    });

    it('notifies all admins at the establishment when the application is granted', () => {
      return this.recipientBuilder.getNotifications(pilApplicationGranted)
        .then(recipients => {
          assert(recipients.has(holc), 'holc is in the recipients list');
          assert(recipients.get(holc).emailTemplate === 'task-closed', 'email type is task-closed');
          assert(recipients.get(holc).applicant.id === basic, 'basic user is the applicant');
          assert(recipients.has(croydonAdmin), 'croydonAdmin is in the recipients list');
          assert(recipients.get(croydonAdmin).emailTemplate === 'task-closed', 'email type is task-closed');
          assert(recipients.get(croydonAdmin).applicant.id === basic, 'basic user is the applicant');
        });
    });

    it('notifies all admins at the establishment when the application is rejected', () => {
      return this.recipientBuilder.getNotifications(pilApplicationRejected)
        .then(recipients => {
          assert(recipients.has(holc), 'holc is in the recipients list');
          assert(recipients.get(holc).emailTemplate === 'task-closed', 'email type is task-closed');
          assert(recipients.get(holc).applicant.id === basic, 'basic user is the applicant');
          assert(recipients.has(croydonAdmin), 'croydonAdmin is in the recipients list');
          assert(recipients.get(croydonAdmin).emailTemplate === 'task-closed', 'email type is task-closed');
          assert(recipients.get(croydonAdmin).applicant.id === basic, 'basic user is the applicant');
        });
    });

  });

});
