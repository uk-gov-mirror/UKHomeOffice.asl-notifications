const assert = require('assert');
const { merge } = require('lodash');
const dbHelper = require('../../../helpers/db');
const logger = require('../../../helpers/logger');
const Recipients = require('../../../../lib/recipients');
const { croydonAdmin1, croydonAdmin2, croydonAdminUnsubscribed } = require('../../../helpers/users');

const {
  pelAmendmentSubmitted,
  pelAmendmentApproved,
  pelAmendmentGranted,
  pelAmendmentRejected
} = require('../../../data/tasks');

const makeUpdate = task => {
  return merge({}, task, { data: { action: 'update' } });
};

describe('Place update (Establishment amendment)', () => {

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

    it('notifies the applicant when the amendment lands with ASRU', () => {
      return this.recipientBuilder.getNotifications(makeUpdate(pelAmendmentSubmitted))
        .then(recipients => {
          assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
          assert(recipients.get(croydonAdmin1).emailTemplate === 'task-with-asru', 'email type is task-with-asru');
          assert(recipients.get(croydonAdmin1).applicant.id === croydonAdmin1, 'croydonAdmin1 is the applicant');
        });
    });

    it('does not notify the applicant when moving between inspectors and licensing', () => {
      return this.recipientBuilder.getNotifications(makeUpdate(pelAmendmentApproved))
        .then(recipients => {
          assert(!recipients.has(croydonAdmin1), 'croydonAdmin1 is not in the recipients list');
        });
    });

    it('notifies the applicant when the amendment is granted', () => {
      return this.recipientBuilder.getNotifications(makeUpdate(pelAmendmentGranted))
        .then(recipients => {
          assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
          assert(recipients.get(croydonAdmin1).emailTemplate === 'licence-amended', 'email type is licence-amended');
          assert(recipients.get(croydonAdmin1).applicant.id === croydonAdmin1, 'croydonAdmin1 is the applicant');
        });
    });

    it('notifies the applicant when the amendment is rejected', () => {
      return this.recipientBuilder.getNotifications(makeUpdate(pelAmendmentRejected))
        .then(recipients => {
          assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
          assert(recipients.get(croydonAdmin1).emailTemplate === 'task-closed', 'email type is task-closed');
          assert(recipients.get(croydonAdmin1).applicant.id === croydonAdmin1, 'croydonAdmin1 is the applicant');
        });
    });

  });

  describe('Establishment admins', () => {

    it('does not override the applicant email if the applicant is also an admin', () => {
      return this.recipientBuilder.getNotifications(makeUpdate(pelAmendmentSubmitted))
        .then(recipients => {
          assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
          assert(recipients.get(croydonAdmin1).emailTemplate === 'task-with-asru', 'email type is task-with-asru');
        });
    });

    it('notifies other subscribed admins at the establishment when the amendment lands with ASRU', () => {
      return this.recipientBuilder.getNotifications(makeUpdate(pelAmendmentSubmitted))
        .then(recipients => {
          assert(recipients.has(croydonAdmin2), 'croydonAdmin2 is in the recipients list');
          assert(recipients.get(croydonAdmin2).emailTemplate === 'task-with-asru', 'email type is task-with-asru');
          assert(recipients.get(croydonAdmin2).applicant.id === croydonAdmin1, 'croydonAdmin1 is the applicant');
          assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
        });
    });

    it('does not notify other admins at the establishment when moving between inspectors and licensing', () => {
      return this.recipientBuilder.getNotifications(makeUpdate(pelAmendmentApproved))
        .then(recipients => {
          assert(!recipients.has(croydonAdmin2), 'croydonAdmin2 is not in the recipients list');
          assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
        });
    });

    it('notifies other subscribed admins at the establishment when the amendment is granted', () => {
      return this.recipientBuilder.getNotifications(makeUpdate(pelAmendmentGranted))
        .then(recipients => {
          assert(recipients.has(croydonAdmin2), 'research101Admin2 is in the recipients list');
          assert(recipients.get(croydonAdmin2).emailTemplate === 'licence-amended', 'email type is licence-amended');
          assert(recipients.get(croydonAdmin2).applicant.id === croydonAdmin1, 'croydonAdmin1 is the applicant');
          assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
        });
    });

    it('notifies other subscribed admins at the establishment when the amendment is rejected', () => {
      return this.recipientBuilder.getNotifications(makeUpdate(pelAmendmentRejected))
        .then(recipients => {
          assert(recipients.has(croydonAdmin2), 'croydonAdmin2 is in the recipients list');
          assert(recipients.get(croydonAdmin2).emailTemplate === 'task-closed', 'email type is task-closed');
          assert(recipients.get(croydonAdmin2).applicant.id === croydonAdmin1, 'croydonAdmin1 is the applicant');
          assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
        });
    });

  });

});
