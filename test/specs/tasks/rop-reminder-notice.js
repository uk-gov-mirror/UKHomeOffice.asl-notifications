const { v4: uuid } = require('uuid');
const sinon = require('sinon');
const moment = require('moment');
const assert = require('assert');
const dbHelper = require('../../helpers/db');
const logger = require('../../helpers/logger');
const ropReminderNotice = require('../../../jobs/rop-reminder-notice-deadline');
const ropReminderActive = require('../../../jobs/rop-reminder-notice-active');
const { basic } = require('../../helpers/users');

const publicUrl = 'http://localhost:8080';
const projectId = uuid();

describe('ROP reminder notice', () => {
  before(() => {
    this.schema = dbHelper.init();
  });

  beforeEach(() => {
    this.sendEmail = sinon.stub();

    return dbHelper.reset(this.schema)
      .then(() => dbHelper.loadFixtures(this.schema));
  });

  after(() => {
    return this.schema.destroy();
  });

  const aProject = (
    {
      id = projectId,
      status = 'active',
      expiryDate,
      revocationDate
    }
  ) => {
    return this.schema.Project.query().insert({
      id: id,
      licenceHolderId: basic,
      status: status,
      establishmentId: 8201,
      licenceNumber: 'XYZ-12345',
      expiryDate: expiryDate && expiryDate.toISOString(),
      revocationDate: revocationDate && revocationDate.toISOString()
    });
  };

  const assertNotifications = (notifications, expectedRecipients, expectedSubject) => {
    assert.equal(notifications.length, expectedRecipients.length);
    assert.deepEqual(notifications.map(n => n.to).sort(), expectedRecipients.sort());
    notifications.forEach(notification => {
      assert.equal(notification.subject, expectedSubject);
    });
  };

  describe('1 Month ROP reminder notice for active projects', () => {
    it('does not add notifications for submitted ROPs', () => {
      const rop = {
        id: uuid(),
        projectId: projectId,
        status: 'submitted',
        year: moment().year()
      };

      return Promise.resolve()
        .then(() => aProject({}))
        .then(() => this.schema.Rop.query().insert(rop))
        .then(() => ropReminderActive({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          assert.equal(notifications.length, 0);
        });
    });

    it('does not add notifications for non-active projects', () => {
      return Promise.resolve()
        .then(() => aProject({ id: uuid(), status: 'expired' }))
        .then(() => aProject({ id: uuid(), status: 'pending' }))
        .then(() => aProject({ id: uuid(), status: 'revoked' }))
        .then(() => ropReminderActive({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          assert.equal(notifications.length, 0);
        });
    });

    it('adds notifications for ROPs due in 1 month', () => {
      return Promise.resolve()
        .then(() => aProject({}))
        .then(() => ropReminderActive({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Reminder: Return of procedures due in 1 month for project licence XYZ-12345';
          const recipients = ['basic.user@example.com'];
          assertNotifications(notifications, recipients, expectedSubject);
        });
    });
  });

  describe('ROP reminder notice for daily job', () => {
    it('does not add notifications for submitted ROPs', () => {
      const rop = {
        id: uuid(),
        projectId: projectId,
        status: 'submitted',
        year: moment().year()
      };

      return Promise.resolve()
        .then(() => aProject({ expiryDate: moment().utc().subtract(28, 'days') }))
        .then(() => this.schema.Rop.query().insert(rop))
        .then(() => ropReminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          assert.equal(notifications.length, 0);
        });
    });

    it('adds notifications for active project ROPs due in 1 week', () => {

      return Promise.resolve()
        .then(() => aProject({ expiryDate: moment().utc().subtract(21, 'days') }))
        .then(() => ropReminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Reminder: Return of procedures due in 1 week for project licence XYZ-12345';
          const expectedRecipients = ['basic.user@example.com'];

          assertNotifications(notifications, expectedRecipients, expectedSubject);
        });
    });

    it('adds notifications for expired project ROPs due in 1 week', () => {

      return Promise.resolve()
        .then(() => aProject({ status: 'expired', expiryDate: moment().utc().subtract(21, 'days') }))
        .then(() => ropReminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Reminder: Return of procedures due in 1 week for expired project licence XYZ-12345';
          const expectedRecipients = ['basic.user@example.com'];

          assertNotifications(notifications, expectedRecipients, expectedSubject);
        });
    });

    it('adds notifications for ROPs due today', () => {
      return Promise.resolve()
        .then(() => aProject({ expiryDate: moment().utc().subtract(28, 'days') }))
        .then(() => ropReminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Reminder: Return of procedures due today for project licence XYZ-12345';
          const expectedRecipients = ['basic.user@example.com'];

          assertNotifications(notifications, expectedRecipients, expectedSubject);
        });
    });

    it('adds notifications for expired project ROPs due today', () => {
      return Promise.resolve()
        .then(() => aProject({ status: 'expired', expiryDate: moment().utc().subtract(28, 'days') }))
        .then(() => ropReminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Reminder: Return of procedures due today for expired project licence XYZ-12345';
          const expectedRecipients = ['basic.user@example.com'];

          assertNotifications(notifications, expectedRecipients, expectedSubject);
        });
    });

    it('adds notifications for revoked project ROPs due today', () => {
      return Promise.resolve()
        .then(() => aProject({ status: 'revoked', revocationDate: moment().utc().subtract(28, 'days') }))
        .then(() => ropReminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Reminder: Return of procedures due today for revoked project licence XYZ-12345';
          const expectedRecipients = ['basic.user@example.com'];

          assertNotifications(notifications, expectedRecipients, expectedSubject);
        });
    });
  });

});
