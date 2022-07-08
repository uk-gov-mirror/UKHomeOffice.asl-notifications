const assert = require('assert');
const dbHelper = require('../../../helpers/db');
const logger = require('../../../helpers/logger');
const Recipients = require('../../../../lib/recipients');
const {
  basic,
  croydonAdmin1,
  croydonAdmin2,
  croydonAdminUnsubscribed,
  croydonNtco,
  marvellAdmin,
  marvellAdminUnsubscribed,
  marvellNtco
} = require('../../../helpers/users');

const {
  pilTransferSubmitted,
  pilTransferEndorsed,
  pilTransferApproved,
  pilTransferGranted,
  pilTransferRejected
} = require('../../../data/tasks');

describe('PIL transfers', () => {

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

    it('notifies the applicant when a new transfer is submitted', () => {
      return this.recipientBuilder.getNotifications(pilTransferSubmitted)
        .then(recipients => {
          assert(recipients.has(basic), 'basic user is in the recipients list');
          assert(recipients.get(basic).emailTemplate === 'task-opened', 'email type is task-opened');
          assert(recipients.get(basic).applicant.id === basic, 'basic user is the applicant');
        });
    });

    it('notifies the applicant when the transfer lands with ASRU', () => {
      return this.recipientBuilder.getNotifications(pilTransferEndorsed)
        .then(recipients => {
          assert(recipients.has(basic), 'basic user is in the recipients list');
          assert(recipients.get(basic).emailTemplate === 'task-with-asru', 'email type is task-with-asru');
          assert(recipients.get(basic).applicant.id === basic, 'basic user is the applicant');
        });
    });

    it('does not notify the applicant when moving between inspectors and licensing', () => {
      return this.recipientBuilder.getNotifications(pilTransferApproved)
        .then(recipients => {
          assert(!recipients.has(basic), 'basic user is not in the recipients list');
        });
    });

    it('notifies the applicant when the transfer is granted', () => {
      return this.recipientBuilder.getNotifications(pilTransferGranted)
        .then(recipients => {
          assert(recipients.has(basic), 'basic user is in the recipients list');
          assert(recipients.get(basic).emailTemplate === 'licence-granted', 'email type is licence-granted');
          assert(recipients.get(basic).applicant.id === basic, 'basic user is the applicant');
        });
    });

    it('notifies the applicant when the transfer is rejected', () => {
      return this.recipientBuilder.getNotifications(pilTransferRejected)
        .then(recipients => {
          assert(recipients.has(basic), 'basic user is in the recipients list');
          assert(recipients.get(basic).emailTemplate === 'task-closed', 'email type is task-closed');
          assert(recipients.get(basic).applicant.id === basic, 'basic user is the applicant');
        });
    });

  });

  describe('Receiving Establishment', () => {

    describe('NTCOs', () => {

      it('notifies all NTCOs at the receiving establishment when a new transfer is awaiting endorsement', () => {
        return this.recipientBuilder.getNotifications(pilTransferSubmitted)
          .then(recipients => {
            assert(recipients.has(marvellNtco), 'marvellNtco is in the recipients list');
            assert(recipients.get(marvellNtco).emailTemplate === 'task-action-required', 'email type is task-action-required');
            assert(recipients.get(marvellNtco).applicant.id === basic, 'basic user is the applicant');
          });
      });

      it('does not notify any NTCOs at the receiving establishment when a transfer lands with ASRU', () => {
        return this.recipientBuilder.getNotifications(pilTransferEndorsed)
          .then(recipients => {
            assert(!recipients.has(marvellNtco), 'marvellNtco is not in the recipients list');
          });
      });

      it('does not notify any NTCOs at the receiving establishment when moving between inspectors and licensing', () => {
        return this.recipientBuilder.getNotifications(pilTransferApproved)
          .then(recipients => {
            assert(!recipients.has(marvellNtco), 'marvellNtco is not in the recipients list');
          });
      });

      it('notifies all NTCOs at the receiving establishment when the transfer is granted', () => {
        return this.recipientBuilder.getNotifications(pilTransferGranted)
          .then(recipients => {
            assert(recipients.has(marvellNtco), 'marvellNtco is in the recipients list');
            assert(recipients.get(marvellNtco).emailTemplate === 'licence-granted', 'email type is licence-granted');
            assert(recipients.get(marvellNtco).applicant.id === basic, 'basic user is the applicant');
          });
      });

      it('notifies all NTCOs at the receiving establishment when the transfer is rejected', () => {
        return this.recipientBuilder.getNotifications(pilTransferRejected)
          .then(recipients => {
            assert(recipients.has(marvellNtco), 'marvellNtco is in the recipients list');
            assert(recipients.get(marvellNtco).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(marvellNtco).applicant.id === basic, 'basic user is the applicant');
          });
      });

    });

    describe('Admins', () => {

      it('notifies all subscribed admins at the receiving establishment when a new transfer is submitted', () => {
        return this.recipientBuilder.getNotifications(pilTransferSubmitted)
          .then(recipients => {
            assert(recipients.has(marvellAdmin), 'marvellAdmin is in the recipients list');
            assert(recipients.get(marvellAdmin).emailTemplate === 'task-opened', 'email type is task-opened');
            assert(recipients.get(marvellAdmin).applicant.id === basic, 'basic user is the applicant');
            assert(!recipients.has(marvellAdminUnsubscribed), 'marvellAdminUnsubscribed is not in the recipients list');
          });
      });

      it('does not notify any admins at the receiving establishment when a transfer lands with ASRU', () => {
        return this.recipientBuilder.getNotifications(pilTransferEndorsed)
          .then(recipients => {
            assert(!recipients.has(marvellAdmin), 'marvellAdmin is not in the recipients list');
            assert(!recipients.has(marvellAdminUnsubscribed), 'marvellAdminUnsubscribed is not in the recipients list');
          });
      });

      it('does not notify any admins at the receiving establishment when moving between inspectors and licensing', () => {
        return this.recipientBuilder.getNotifications(pilTransferApproved)
          .then(recipients => {
            assert(!recipients.has(marvellAdmin), 'marvellAdmin is not in the recipients list');
            assert(!recipients.has(marvellAdminUnsubscribed), 'marvellAdminUnsubscribed is not in the recipients list');
          });
      });

      it('notifies all subscribed admins at the receiving establishment when the transfer is granted', () => {
        return this.recipientBuilder.getNotifications(pilTransferGranted)
          .then(recipients => {
            assert(recipients.has(marvellAdmin), 'marvellAdmin is in the recipients list');
            assert(recipients.get(marvellAdmin).emailTemplate === 'licence-granted', 'email type is licence-granted');
            assert(recipients.get(marvellAdmin).applicant.id === basic, 'basic user is the applicant');
            assert(!recipients.has(marvellAdminUnsubscribed), 'marvellAdminUnsubscribed is not in the recipients list');
          });
      });

      it('notifies all subscribed admins at the receiving establishment when the transfer is rejected', () => {
        return this.recipientBuilder.getNotifications(pilTransferRejected)
          .then(recipients => {
            assert(recipients.has(marvellAdmin), 'marvellAdmin is in the recipients list');
            assert(recipients.get(marvellAdmin).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(marvellAdmin).applicant.id === basic, 'basic user is the applicant');
            assert(!recipients.has(marvellAdminUnsubscribed), 'marvellAdminUnsubscribed is not in the recipients list');
          });
      });

    });

  });

  describe('Outgoing Establishment', () => {

    describe('NTCOs', () => {

      it('notifies all NTCOs at the outgoing establishment when a new transfer is started', () => {
        return this.recipientBuilder.getNotifications(pilTransferSubmitted)
          .then(recipients => {
            assert(recipients.has(croydonNtco), 'croydonNtco is in the recipients list');
            assert(recipients.get(croydonNtco).emailTemplate === 'task-opened', 'email type is task-opened');
            assert(recipients.get(croydonNtco).applicant.id === basic, 'basic user is the applicant');
          });
      });

      it('does not notify any NTCOs at the outgoing establishment when a transfer lands with ASRU', () => {
        return this.recipientBuilder.getNotifications(pilTransferEndorsed)
          .then(recipients => {
            assert(!recipients.has(croydonNtco), 'croydonNtco is not in the recipients list');
          });
      });

      it('does not notify any NTCOs at the outgoing establishment when moving between inspectors and licensing', () => {
        return this.recipientBuilder.getNotifications(pilTransferApproved)
          .then(recipients => {
            assert(!recipients.has(croydonNtco), 'croydonNtco is not in the recipients list');
          });
      });

      it('notifies all NTCOs at the outgoing establishment when the transfer is granted', () => {
        return this.recipientBuilder.getNotifications(pilTransferGranted)
          .then(recipients => {
            assert(recipients.has(croydonNtco), 'croydonNtco is in the recipients list');
            assert(recipients.get(croydonNtco).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(croydonNtco).applicant.id === basic, 'basic user is the applicant');
          });
      });

      it('notifies all NTCOs at the outgoing establishment when the transfer is rejected', () => {
        return this.recipientBuilder.getNotifications(pilTransferRejected)
          .then(recipients => {
            assert(recipients.has(croydonNtco), 'croydonNtco is in the recipients list');
            assert(recipients.get(croydonNtco).emailTemplate === 'task-closed', 'email type is task-closed');
            assert(recipients.get(croydonNtco).applicant.id === basic, 'basic user is the applicant');
          });
      });

    });

    describe('Admins', () => {

      it('notifies all subscribed admins at the outgoing establishment when a new transfer is submitted', () => {
        return this.recipientBuilder.getNotifications(pilTransferSubmitted)
          .then(recipients => {
            assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
            assert(recipients.get(croydonAdmin1).emailTemplate === 'task-opened', 'email type is task-opened');
            assert(recipients.get(croydonAdmin1).applicant.id === basic, 'basic user is the applicant');
            assert(recipients.has(croydonAdmin2), 'croydonAdmin2 is in the recipients list');
            assert(recipients.get(croydonAdmin2).emailTemplate === 'task-opened', 'email type is task-opened');
            assert(recipients.get(croydonAdmin2).applicant.id === basic, 'basic user is the applicant');
            assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
          });
      });

      it('does not notify any admins at the outgoing establishment when a transfer lands with ASRU', () => {
        return this.recipientBuilder.getNotifications(pilTransferEndorsed)
          .then(recipients => {
            assert(!recipients.has(croydonAdmin1), 'croydonAdmin1 is not in the recipients list');
            assert(!recipients.has(croydonAdmin2), 'croydonAdmin2 is not in the recipients list');
            assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
          });
      });

      it('does not notify any admins at the outgoing establishment when moving between inspectors and licensing', () => {
        return this.recipientBuilder.getNotifications(pilTransferApproved)
          .then(recipients => {
            assert(!recipients.has(croydonAdmin1), 'croydonAdmin1 is not in the recipients list');
            assert(!recipients.has(croydonAdmin2), 'croydonAdmin2 is not in the recipients list');
            assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
          });
      });

      it('notifies all subscribed admins at the outgoing establishment when the transfer is granted', () => {
        return this.recipientBuilder.getNotifications(pilTransferGranted)
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

      it('notifies all subscribed admins at the outgoing establishment when the transfer is rejected', () => {
        return this.recipientBuilder.getNotifications(pilTransferRejected)
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

  });

});
