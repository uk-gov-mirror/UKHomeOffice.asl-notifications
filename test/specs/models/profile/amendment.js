const assert = require('assert');
const dbHelper = require('../../../helpers/db');
const logger = require('../../../helpers/logger');
const Recipients = require('../../../../lib/recipients');
const { basic } = require('../../../helpers/users');

const {
  profileAmendmentAutoresolved,
  profileAmendmentSubmitted,
  profileAmendmentApproved,
  profileAmendmentGranted,
  profileAmendmentRejected
} = require('../../../data/tasks');

describe('Profile amendment', () => {

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

  describe('No review required', () => {

    describe('Applicant', () => {

      it('does not notify the profile owner that the change has been made', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentAutoresolved)
          .then(recipients => {
            assert(!recipients.has(basic), 'basic is not in the recipients list');
          });
      });

    });

  });

  describe('ASRU review required (applicant has licence or named role)', () => {

    describe('Applicant', () => {

      it('only notifies the applicant when the amendment lands with ASRU', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentSubmitted)
          .then(recipients => {
            assert.equal(recipients.size, 1);
            assert(recipients.has(basic), 'basic user is in the recipients list');
            assert(recipients.get(basic).emailTemplate === 'task-with-asru', 'email type is task-with-asru');
            assert(recipients.get(basic).applicant.id === basic, 'basic user is the applicant');
          });
      });

      it('does not notify the applicant when moving between inspectors and licensing', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentApproved)
          .then(recipients => {
            assert(!recipients.has(basic), 'basic user is not in the recipients list');
          });
      });

      it('only notifies the applicant when the amendment is granted', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentGranted)
          .then(recipients => {
            assert.equal(recipients.size, 1);
            assert(recipients.has(basic), 'basic user is in the recipients list');
            assert(recipients.get(basic).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(basic).applicant.id === basic, 'basic user is the applicant');
          });
      });

      it('only notifies the applicant when the amendment is rejected', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentRejected)
          .then(recipients => {
            assert.equal(recipients.size, 1);
            assert(recipients.has(basic), 'basic user is in the recipients list');
            assert(recipients.get(basic).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(basic).applicant.id === basic, 'basic user is the applicant');
          });
      });

    });

  });

});
