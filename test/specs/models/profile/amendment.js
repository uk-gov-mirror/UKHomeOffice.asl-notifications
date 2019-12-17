const assert = require('assert');
const dbHelper = require('../../../helpers/db');
const logger = require('../../../helpers/logger');
const Recipients = require('../../../../lib/recipients');
const { basic, croydonAdmin1, croydonAdmin2, croydonNtco, marvellAdmin, marvellNtco } = require('../../../helpers/users');

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
    return dbHelper.reset()
      .then(() => dbHelper.loadFixtures(this.schema));
  });

  after(() => {
    return this.schema.destroy();
  });

  describe('No review required', () => {

    describe('Applicant', () => {

      it('notifies the profile owner that the change has been made', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentAutoresolved)
          .then(recipients => {
            assert(recipients.has(basic), 'basic is in the recipients list');
            assert(recipients.get(basic).emailTemplate === 'profile-updated', 'email type is profile-updated');
          });
      });

    });

    describe('Related establishment admins', () => {

      it('does not notify any admins at related establishments when no review is required', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentAutoresolved)
          .then(recipients => {
            assert(!recipients.has(croydonAdmin1), 'croydonAdmin1 is not in the recipients list');
            assert(!recipients.has(croydonAdmin2), 'croydonAdmin2 is not in the recipients list');
            assert(!recipients.has(marvellAdmin), 'marvellAdmin is not in the recipients list');
          });
      });

    });

    describe('Related establishment NTCOs', () => {

      it('does not notify any NTCOs at related establishments when no review is required', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentAutoresolved)
          .then(recipients => {
            assert(!recipients.has(croydonNtco), 'croydonNtco is not in the recipients list');
            assert(!recipients.has(marvellNtco), 'marvellNtco is not in the recipients list');
          });
      });

    });

  });

  describe('ASRU review required (applicant has licence or named role)', () => {

    describe('Applicant', () => {

      it('notifies the applicant when the amendment lands with ASRU', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentSubmitted)
          .then(recipients => {
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

      it('notifies the applicant when the amendment is granted', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentGranted)
          .then(recipients => {
            assert(recipients.has(basic), 'basic user is in the recipients list');
            assert(recipients.get(basic).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(basic).applicant.id === basic, 'basic user is the applicant');
          });
      });

      it('notifies the applicant when the amendment is rejected', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentRejected)
          .then(recipients => {
            assert(recipients.has(basic), 'basic user is in the recipients list');
            assert(recipients.get(basic).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(basic).applicant.id === basic, 'basic user is the applicant');
          });
      });

    });

    describe('Related establishment admins', () => {

      it('notifies related establishment admins when a new amendment is submitted', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentSubmitted)
          .then(recipients => {
            assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
            assert(recipients.get(croydonAdmin1).emailTemplate === 'task-opened', 'email type is task-opened');
            assert(recipients.get(croydonAdmin1).applicant.id === basic, 'basic user is the applicant');
            assert(recipients.has(croydonAdmin2), 'croydonAdmin2 is in the recipients list');
            assert(recipients.get(croydonAdmin2).emailTemplate === 'task-opened', 'email type is task-opened');
            assert(recipients.get(croydonAdmin2).applicant.id === basic, 'basic user is the applicant');
            assert(recipients.has(marvellAdmin), 'marvellAdmin is in the recipients list');
            assert(recipients.get(marvellAdmin).emailTemplate === 'task-opened', 'email type is task-opened');
            assert(recipients.get(marvellAdmin).applicant.id === basic, 'basic user is the applicant');
          });
      });

      it('does not notify any related establishment admins when moving between inspectors and licensing', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentApproved)
          .then(recipients => {
            assert(!recipients.has(croydonAdmin1), 'croydonAdmin1 is not in the recipients list');
            assert(!recipients.has(croydonAdmin2), 'croydonAdmin2 is not in the recipients list');
            assert(!recipients.has(marvellAdmin), 'marvellAdmin is not in the recipients list');
          });
      });

      it('notifies all related establishment admins when the amendment is granted', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentGranted)
          .then(recipients => {
            assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
            assert(recipients.get(croydonAdmin1).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(croydonAdmin1).applicant.id === basic, 'basic user is the applicant');
            assert(recipients.has(croydonAdmin2), 'croydonAdmin2 is in the recipients list');
            assert(recipients.get(croydonAdmin2).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(croydonAdmin2).applicant.id === basic, 'basic user is the applicant');
            assert(recipients.has(marvellAdmin), 'marvellAdmin is in the recipients list');
            assert(recipients.get(marvellAdmin).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(marvellAdmin).applicant.id === basic, 'basic user is the applicant');
          });
      });

      it('notifies all related establishment admins when the amendment is rejected', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentRejected)
          .then(recipients => {
            assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
            assert(recipients.get(croydonAdmin1).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(croydonAdmin1).applicant.id === basic, 'basic user is the applicant');
            assert(recipients.has(croydonAdmin2), 'croydonAdmin2 is in the recipients list');
            assert(recipients.get(croydonAdmin2).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(croydonAdmin2).applicant.id === basic, 'basic user is the applicant');
            assert(recipients.has(marvellAdmin), 'marvellAdmin is in the recipients list');
            assert(recipients.get(marvellAdmin).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(marvellAdmin).applicant.id === basic, 'basic user is the applicant');
          });
      });

    });

    describe('Related establishment NTCOs', () => {

      it('notifies related establishment NTCOs when a new amendment is submitted', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentSubmitted)
          .then(recipients => {
            assert(recipients.has(croydonNtco), 'croydonNtco is in the recipients list');
            assert(recipients.get(croydonNtco).emailTemplate === 'task-opened', 'email type is task-opened');
            assert(recipients.get(croydonNtco).applicant.id === basic, 'basic user is the applicant');
            assert(recipients.has(marvellNtco), 'marvellNtco is in the recipients list');
            assert(recipients.get(marvellNtco).emailTemplate === 'task-opened', 'email type is task-opened');
            assert(recipients.get(marvellNtco).applicant.id === basic, 'basic user is the applicant');
          });
      });

      it('does not notify any related establishment NTCOs when moving between inspectors and licensing', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentApproved)
          .then(recipients => {
            assert(!recipients.has(croydonNtco), 'croydonNtco is not in the recipients list');
            assert(!recipients.has(marvellNtco), 'marvellNtco is not in the recipients list');
          });
      });

      it('notifies all related establishment NTCOs when the amendment is granted', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentGranted)
          .then(recipients => {
            assert(recipients.has(croydonNtco), 'croydonNtco is in the recipients list');
            assert(recipients.get(croydonNtco).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(croydonNtco).applicant.id === basic, 'basic user is the applicant');
            assert(recipients.has(marvellNtco), 'marvellNtco is in the recipients list');
            assert(recipients.get(marvellNtco).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(marvellNtco).applicant.id === basic, 'basic user is the applicant');
          });
      });

      it('notifies all related establishment NTCOs when the amendment is rejected', () => {
        return this.recipientBuilder.getNotifications(profileAmendmentRejected)
          .then(recipients => {
            assert(recipients.has(croydonNtco), 'croydonNtco is in the recipients list');
            assert(recipients.get(croydonNtco).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(croydonNtco).applicant.id === basic, 'basic user is the applicant');
            assert(recipients.has(marvellNtco), 'marvellNtco is in the recipients list');
            assert(recipients.get(marvellNtco).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(marvellNtco).applicant.id === basic, 'basic user is the applicant');
          });
      });

    });

  });

});
