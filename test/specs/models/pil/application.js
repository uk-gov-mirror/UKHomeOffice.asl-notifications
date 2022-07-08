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
  marvellAdminUnsubscribed
} = require('../../../helpers/users');

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
    return dbHelper.reset(this.schema)
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
          assert(recipients.get(basic).emailTemplate === 'licence-granted', 'email type is licence-granted');
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

  describe('Establishment NTCOs', () => {

    it('notifies all NTCOs at the establishment when a new application is awaiting endorsement', () => {
      return this.recipientBuilder.getNotifications(pilApplicationSubmitted)
        .then(recipients => {
          assert(recipients.has(croydonNtco), 'croydonNtco is in the recipients list');
          assert(recipients.get(croydonNtco).emailTemplate === 'task-action-required', 'email type is task-action-required');
          assert(recipients.get(croydonNtco).applicant.id === basic, 'basic user is the applicant');
        });
    });

    it('does not notify any NTCOs at the establishment when an application lands with ASRU', () => {
      return this.recipientBuilder.getNotifications(pilApplicationEndorsed)
        .then(recipients => {
          assert(!recipients.has(croydonNtco), 'croydonNtco is not in the recipients list');
        });
    });

    it('does not notify any NTCOs when moving between inspectors and licensing', () => {
      return this.recipientBuilder.getNotifications(pilApplicationApproved)
        .then(recipients => {
          assert(!recipients.has(croydonNtco), 'croydonNtco is not in the recipients list');
        });
    });

    it('notifies all NTCOs when the application is granted', () => {
      return this.recipientBuilder.getNotifications(pilApplicationGranted)
        .then(recipients => {
          assert(recipients.has(croydonNtco), 'croydonNtco is in the recipients list');
          assert(recipients.get(croydonNtco).emailTemplate === 'licence-granted', 'email type is licence-granted');
          assert(recipients.get(croydonNtco).applicant.id === basic, 'basic user is the applicant');
        });
    });

    it('notifies all NTCOs when the application is rejected', () => {
      return this.recipientBuilder.getNotifications(pilApplicationRejected)
        .then(recipients => {
          assert(recipients.has(croydonNtco), 'croydonNtco is in the recipients list');
          assert(recipients.get(croydonNtco).emailTemplate === 'task-closed', 'email type is task-closed');
          assert(recipients.get(croydonNtco).applicant.id === basic, 'basic user is the applicant');
        });
    });

  });

  describe('Establishment admins', () => {

    it('notifies all subscribed admins at the establishment when a new application is submitted', () => {
      return this.recipientBuilder.getNotifications(pilApplicationSubmitted)
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

    it('does not notify any admins at the establishment when an application lands with ASRU', () => {
      return this.recipientBuilder.getNotifications(pilApplicationEndorsed)
        .then(recipients => {
          assert(!recipients.has(croydonAdmin1), 'croydonAdmin1 is not in the recipients list');
          assert(!recipients.has(croydonAdmin2), 'croydonAdmin2 is not in the recipients list');
          assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
        });
    });

    it('does not notify any admins at the establishment when moving between inspectors and licensing', () => {
      return this.recipientBuilder.getNotifications(pilApplicationApproved)
        .then(recipients => {
          assert(!recipients.has(croydonAdmin1), 'croydonAdmin1 is not in the recipients list');
          assert(!recipients.has(croydonAdmin2), 'croydonAdmin2 is not in the recipients list');
          assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
        });
    });

    it('notifies all subscribed admins at the establishment when the application is granted', () => {
      return this.recipientBuilder.getNotifications(pilApplicationGranted)
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
      return this.recipientBuilder.getNotifications(pilApplicationRejected)
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

  describe('Non-owning establishment admins', () => {

    it('does not notify non-owning establishment admins when a new application is submitted', () => {
      return this.recipientBuilder.getNotifications(pilApplicationSubmitted)
        .then(recipients => {
          assert(!recipients.has(marvellAdmin), 'marvellAdmin is not in the recipients list');
          assert(!recipients.has(marvellAdminUnsubscribed), 'marvellAdminUnsubscribed is not in the recipients list');
        });
    });

    it('does not notify non-owning establishment admins when an application lands with ASRU', () => {
      return this.recipientBuilder.getNotifications(pilApplicationEndorsed)
        .then(recipients => {
          assert(!recipients.has(marvellAdmin), 'marvellAdmin is not in the recipients list');
          assert(!recipients.has(marvellAdminUnsubscribed), 'marvellAdminUnsubscribed is not in the recipients list');
        });
    });

    it('does not notify non-owning establishment admins when moving between inspectors and licensing', () => {
      return this.recipientBuilder.getNotifications(pilApplicationApproved)
        .then(recipients => {
          assert(!recipients.has(marvellAdmin), 'marvellAdmin is not in the recipients list');
          assert(!recipients.has(marvellAdminUnsubscribed), 'marvellAdminUnsubscribed is not in the recipients list');
        });
    });

    it('does not notify non-owning establishment admins when the application is rejected', () => {
      return this.recipientBuilder.getNotifications(pilApplicationRejected)
        .then(recipients => {
          assert(!recipients.has(marvellAdmin), 'marvellAdmin is not in the recipients list');
          assert(!recipients.has(marvellAdminUnsubscribed), 'marvellAdminUnsubscribed is not in the recipients list');
        });
    });

    it('notifies subscribed non-owning establishment admins when the application is granted', () => {
      return this.recipientBuilder.getNotifications(pilApplicationGranted)
        .then(recipients => {
          assert(recipients.has(marvellAdmin), 'marvellAdmin is in the recipients list');
          assert.equal(recipients.get(marvellAdmin).emailTemplate, 'associated-pil-granted', 'email type is task-closed');
          assert.equal(recipients.get(marvellAdmin).establishmentId, 8202, 'establishmentId should be set to Marvell');
          assert(!recipients.has(marvellAdminUnsubscribed), 'marvellAdminUnsubscribed is not in the recipients list');
        });
    });

  });

});
