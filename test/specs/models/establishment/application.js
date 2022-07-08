const assert = require('assert');
const dbHelper = require('../../../helpers/db');
const logger = require('../../../helpers/logger');
const Recipients = require('../../../../lib/recipients');
const { research101Admin, research101Admin2, research101AdminUnsubscribed } = require('../../../helpers/users');

const {
  pelApplicationSubmitted,
  pelApplicationApproved,
  pelApplicationGranted,
  pelApplicationRejected
} = require('../../../data/tasks');

describe('PEL applications', () => {

  before(() => {
    this.schema = dbHelper.init();
    this.recipientBuilder = Recipients({ schema: this.schema, logger });
  });

  beforeEach(() => {
    return dbHelper.reset(this.schema)
      .then(() => dbHelper.loadFixtures(this.schema));
  });

  after(() => {
    return this.schema.destroy();
  });

  describe('Applicant', () => {

    it('notifies the applicant when the application lands with ASRU', () => {
      return this.recipientBuilder.getNotifications(pelApplicationSubmitted)
        .then(recipients => {
          assert(recipients.has(research101Admin), 'research101Admin is in the recipients list');
          assert(recipients.get(research101Admin).emailTemplate === 'task-with-asru', 'email type is task-with-asru');
          assert(recipients.get(research101Admin).applicant.id === research101Admin, 'research101Admin is the applicant');
        });
    });

    it('does not notify the applicant when moving between inspectors and licensing', () => {
      return this.recipientBuilder.getNotifications(pelApplicationApproved)
        .then(recipients => {
          assert(!recipients.has(research101Admin), 'research101Admin is not in the recipients list');
        });
    });

    it('notifies the applicant when the application is granted', () => {
      return this.recipientBuilder.getNotifications(pelApplicationGranted)
        .then(recipients => {
          assert(recipients.has(research101Admin), 'research101Admin is in the recipients list');
          assert(recipients.get(research101Admin).emailTemplate === 'licence-granted', 'email type is licence-granted');
          assert(recipients.get(research101Admin).applicant.id === research101Admin, 'research101Admin is the applicant');
        });
    });

    it('notifies the applicant when the application is rejected', () => {
      return this.recipientBuilder.getNotifications(pelApplicationRejected)
        .then(recipients => {
          assert(recipients.has(research101Admin), 'research101Admin is in the recipients list');
          assert(recipients.get(research101Admin).emailTemplate === 'task-closed', 'email type is task-closed');
          assert(recipients.get(research101Admin).applicant.id === research101Admin, 'research101Admin is the applicant');
        });
    });

  });

  describe('Establishment admins', () => {

    it('does not override the applicant email if the applicant is also an admin', () => {
      return this.recipientBuilder.getNotifications(pelApplicationSubmitted)
        .then(recipients => {
          assert(recipients.has(research101Admin), 'research101Admin is in the recipients list');
          assert(recipients.get(research101Admin).emailTemplate === 'task-with-asru', 'email type is task-with-asru');
        });
    });

    it('notifies other subscribed admins at the establishment when the application lands with ASRU', () => {
      return this.recipientBuilder.getNotifications(pelApplicationSubmitted)
        .then(recipients => {
          assert(recipients.has(research101Admin2), 'research101Admin2 is in the recipients list');
          assert(recipients.get(research101Admin2).emailTemplate === 'task-with-asru', 'email type is task-with-asru');
          assert(recipients.get(research101Admin2).applicant.id === research101Admin, 'research101Admin is the applicant');
          assert(!recipients.has(research101AdminUnsubscribed), 'research101AdminUnsubscribed is not in the recipients list');
        });
    });

    it('does not notify other admins at the establishment when moving between inspectors and licensing', () => {
      return this.recipientBuilder.getNotifications(pelApplicationApproved)
        .then(recipients => {
          assert(!recipients.has(research101Admin2), 'research101Admin2 is not in the recipients list');
          assert(!recipients.has(research101AdminUnsubscribed), 'research101AdminUnsubscribed is not in the recipients list');
        });
    });

    it('notifies other subscribed admins at the establishment when the application is granted', () => {
      return this.recipientBuilder.getNotifications(pelApplicationGranted)
        .then(recipients => {
          assert(recipients.has(research101Admin2), 'research101Admin2 is in the recipients list');
          assert(recipients.get(research101Admin2).emailTemplate === 'licence-granted', 'email type is licence-granted');
          assert(recipients.get(research101Admin2).applicant.id === research101Admin, 'research101Admin is the applicant');
          assert(!recipients.has(research101AdminUnsubscribed), 'research101AdminUnsubscribed is not in the recipients list');
        });
    });

    it('notifies other subscribed admins at the establishment when the application is rejected', () => {
      return this.recipientBuilder.getNotifications(pelApplicationRejected)
        .then(recipients => {
          assert(recipients.has(research101Admin2), 'research101Admin2 is in the recipients list');
          assert(recipients.get(research101Admin2).emailTemplate === 'task-closed', 'email type is task-closed');
          assert(recipients.get(research101Admin2).applicant.id === research101Admin, 'research101Admin is the applicant');
          assert(!recipients.has(research101AdminUnsubscribed), 'research101AdminUnsubscribed is not in the recipients list');
        });
    });

  });

});
