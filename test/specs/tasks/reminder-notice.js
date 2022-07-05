const { v4: uuid } = require('uuid');
const sinon = require('sinon');
const moment = require('moment');
const assert = require('assert');
const dbHelper = require('../../helpers/db');
const logger = require('../../helpers/logger');
const reminderNotice = require('../../../jobs/reminder-notice');
const { basic } = require('../../helpers/users');

const publicUrl = 'http://localhost:8080';
const projectId = uuid();
const pilId = uuid();

describe('Condition reminder notice', () => {

  before(() => {
    this.schema = dbHelper.init();
  });

  beforeEach(() => {
    this.sendEmail = sinon.stub();

    return dbHelper.reset()
      .then(() => dbHelper.loadFixtures(this.schema))
      .then(() => this.schema.PIL.query().insert({
        id: pilId,
        profileId: basic,
        status: 'active',
        establishmentId: 8201,
        licenceNumber: 'PIL-12345'
      }))
      .then(() => this.schema.Project.query().insert({
        id: projectId,
        licenceHolderId: basic,
        status: 'active',
        establishmentId: 8201,
        licenceNumber: 'XYZ-12345'
      }));
  });

  after(() => {
    // return this.schema.destroy();
  });

  describe('Establishment condition reminders', () => {

    it('adds notifications for deadlines due in 1 month', () => {
      const reminder = {
        modelType: 'establishment',
        establishmentId: 8201,
        deadline: moment().add(27, 'days').format('YYYY-MM-DD'),
        status: 'active'
      };

      return Promise.resolve()
        .then(() => this.schema.Reminder.query().insert(reminder))
        .then(() => reminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Reminder: establishment licence XCC09J64D has a condition that is due in 1 month';
          const expected = ['vice-chancellor@example.com', 'croydon.admin@example.com'];

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });

    it('adds notifications for deadlines due in 1 week', () => {
      const reminder = {
        modelType: 'establishment',
        establishmentId: 8201,
        deadline: moment().add(7, 'days').format('YYYY-MM-DD'),
        status: 'active'
      };

      return Promise.resolve()
        .then(() => this.schema.Reminder.query().insert(reminder))
        .then(() => reminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Reminder: establishment licence XCC09J64D has a condition that is due in 1 week';
          const expected = ['vice-chancellor@example.com', 'croydon.admin@example.com'];

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });

    it('adds notifications for deadlines due today', () => {
      const reminder = {
        modelType: 'establishment',
        establishmentId: 8201,
        deadline: moment().format('YYYY-MM-DD'),
        status: 'active'
      };

      return Promise.resolve()
        .then(() => this.schema.Reminder.query().insert(reminder))
        .then(() => reminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Reminder: establishment licence XCC09J64D has a condition that is due today';
          const expected = ['vice-chancellor@example.com', 'croydon.admin@example.com'];

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });

    it('adds enforcement team notifications for deadlines that are overdue', () => {
      const reminder = {
        modelType: 'establishment',
        establishmentId: 8201,
        deadline: moment().subtract(1, 'day').format('YYYY-MM-DD'),
        status: 'active'
      };

      return Promise.resolve()
        .then(() => this.schema.Reminder.query().insert(reminder))
        .then(() => reminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Notification: establishment licence XCC09J64D has a condition that was due yesterday';
          const expected = ['ASRUEnforcement@homeoffice.gov.uk'];

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });

  });

  describe('PIL condition reminders', () => {

    it('adds notifications for deadlines due in 1 month', () => {
      const reminder = {
        modelType: 'pil',
        modelId: pilId,
        establishmentId: 8201,
        deadline: moment().add(27, 'days').format('YYYY-MM-DD'),
        status: 'active'
      };

      return Promise.resolve()
        .then(() => this.schema.Reminder.query().insert(reminder))
        .then(() => reminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Reminder: personal licence PIL-12345 has a condition that is due in 1 month';
          const expected = ['basic.user@example.com', 'ntco@example.com', 'vice-chancellor@example.com', 'croydon.admin@example.com'];

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });

    it('adds notifications for deadlines due in 1 week', () => {
      const reminder = {
        modelType: 'pil',
        modelId: pilId,
        establishmentId: 8201,
        deadline: moment().add(7, 'days').format('YYYY-MM-DD'),
        status: 'active'
      };

      return Promise.resolve()
        .then(() => this.schema.Reminder.query().insert(reminder))
        .then(() => reminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Reminder: personal licence PIL-12345 has a condition that is due in 1 week';
          const expected = ['basic.user@example.com', 'ntco@example.com', 'vice-chancellor@example.com', 'croydon.admin@example.com'];

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });

    it('adds notifications for deadlines due today', () => {
      const reminder = {
        modelType: 'pil',
        modelId: pilId,
        establishmentId: 8201,
        deadline: moment().format('YYYY-MM-DD'),
        status: 'active'
      };

      return Promise.resolve()
        .then(() => this.schema.Reminder.query().insert(reminder))
        .then(() => reminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Reminder: personal licence PIL-12345 has a condition that is due today';
          const expected = ['basic.user@example.com', 'ntco@example.com', 'vice-chancellor@example.com', 'croydon.admin@example.com'];

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });

    it('adds enforcement team notifications for deadlines that are overdue', () => {
      const reminder = {
        modelType: 'pil',
        modelId: pilId,
        establishmentId: 8201,
        deadline: moment().subtract(1, 'day').format('YYYY-MM-DD'),
        status: 'active'
      };

      return Promise.resolve()
        .then(() => this.schema.Reminder.query().insert(reminder))
        .then(() => reminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Notification: personal licence PIL-12345 has a condition that was due yesterday';
          const expected = ['ASRUEnforcement@homeoffice.gov.uk'];

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });

  });

  describe('Project condition reminders', () => {

    it('does not add notifications for pending reminders', () => {
      const reminder = {
        modelType: 'project',
        modelId: projectId,
        establishmentId: 8201,
        deadline: moment().add(6, 'days').format('YYYY-MM-DD'),
        status: 'pending'
      };

      return Promise.resolve()
        .then(() => this.schema.Reminder.query().insert(reminder))
        .then(() => reminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          assert.equal(notifications.length, 0);
        });
    });

    it('adds notifications for deadlines due in 1 month', () => {
      const reminder = {
        modelType: 'project',
        modelId: projectId,
        establishmentId: 8201,
        deadline: moment().add(27, 'days').format('YYYY-MM-DD'),
        status: 'active'
      };

      return Promise.resolve()
        .then(() => this.schema.Reminder.query().insert(reminder))
        .then(() => reminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Reminder: project licence XYZ-12345 has a condition that is due in 1 month';
          const expected = ['basic.user@example.com', 'croydon.admin@example.com', 'vice-chancellor@example.com'];

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });

    it('adds notifications for deadlines due in 1 week', () => {
      const reminder = {
        modelType: 'project',
        modelId: projectId,
        establishmentId: 8201,
        deadline: moment().add(7, 'days').format('YYYY-MM-DD'),
        status: 'active'
      };

      return Promise.resolve()
        .then(() => this.schema.Reminder.query().insert(reminder))
        .then(() => reminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Reminder: project licence XYZ-12345 has a condition that is due in 1 week';
          const expected = ['basic.user@example.com', 'croydon.admin@example.com', 'vice-chancellor@example.com'];

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });

    it('adds notifications for deadlines due today', () => {
      const reminder = {
        modelType: 'project',
        modelId: projectId,
        establishmentId: 8201,
        deadline: moment().format('YYYY-MM-DD'),
        status: 'active'
      };

      return Promise.resolve()
        .then(() => this.schema.Reminder.query().insert(reminder))
        .then(() => reminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Reminder: project licence XYZ-12345 has a condition that is due today';
          const expected = ['basic.user@example.com', 'croydon.admin@example.com', 'vice-chancellor@example.com'];

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });

    it('adds enforcement team notifications for deadlines that are overdue', () => {
      const reminder = {
        modelType: 'project',
        modelId: projectId,
        establishmentId: 8201,
        deadline: moment().subtract(1, 'day').format('YYYY-MM-DD'),
        status: 'active'
      };

      return Promise.resolve()
        .then(() => this.schema.Reminder.query().insert(reminder))
        .then(() => reminderNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expectedSubject = 'Notification: project licence XYZ-12345 has a condition that was due yesterday';
          const expected = ['ASRUEnforcement@homeoffice.gov.uk'];

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });

  });

});
