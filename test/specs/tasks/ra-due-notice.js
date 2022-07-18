const { v4: uuid } = require('uuid');
const sinon = require('sinon');
const moment = require('moment');
const assert = require('assert');
const dbHelper = require('../../helpers/db');
const logger = require('../../helpers/logger');
const raDueNotice = require('../../../jobs/ra-due-notice');
const { basic } = require('../../helpers/users');

const publicUrl = 'http://localhost:8080';

describe('Retrospective assessment due', () => {

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

  describe('Expired projects', () => {
    it('adds a notification for an expired project due an RA in 3 months', () => {
      const project = {
        id: uuid(),
        licenceHolderId: basic,
        expiryDate: moment().subtract(3, 'months').toISOString(),
        raDate: moment().add(3, 'months').subtract(1, 'day').toISOString(),
        status: 'expired',
        establishmentId: 8201,
        licenceNumber: 'XYZ12345'
      };

      return Promise.resolve()
        .then(() => this.schema.Project.query().insert(project))
        .then(() => this.schema.ProjectEstablishment.query().insert({ projectId: project.id, establishmentId: 123, status: 'active' }))
        .then(() => raDueNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expected = [
            'basic.user@example.com',
            'vice-chancellor@example.com',
            'croydon.admin@example.com'
          ];

          const expectedSubject = `Reminder: Retrospective assessment due in 3 months for expired project licence ${project.licenceNumber}`;

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });

    it('adds a notification for an expired project due an RA in 1 month', () => {
      const project = {
        id: uuid(),
        licenceHolderId: basic,
        expiryDate: moment().subtract(5, 'months').toISOString(),
        raDate: moment().add(1, 'months').subtract(1, 'day').toISOString(),
        status: 'expired',
        establishmentId: 8201,
        licenceNumber: 'XYZ12345'
      };

      return Promise.resolve()
        .then(() => this.schema.Project.query().insert(project))
        .then(() => this.schema.ProjectEstablishment.query().insert({ projectId: project.id, establishmentId: 123, status: 'active' }))
        .then(() => raDueNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expected = [
            'basic.user@example.com',
            'vice-chancellor@example.com',
            'croydon.admin@example.com'
          ];

          const expectedSubject = `Reminder: Retrospective assessment due in 1 month for expired project licence ${project.licenceNumber}`;

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });

    it('adds a notification for an expired project due an RA today', () => {
      const project = {
        id: uuid(),
        licenceHolderId: basic,
        expiryDate: moment().subtract(6, 'months').toISOString(),
        raDate: moment().toISOString(),
        status: 'expired',
        establishmentId: 8201,
        licenceNumber: 'XYZ12345'
      };

      return Promise.resolve()
        .then(() => this.schema.Project.query().insert(project))
        .then(() => this.schema.ProjectEstablishment.query().insert({ projectId: project.id, establishmentId: 123, status: 'active' }))
        .then(() => raDueNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expected = [
            'basic.user@example.com',
            'vice-chancellor@example.com',
            'croydon.admin@example.com'
          ];

          const expectedSubject = `Reminder: Retrospective assessment due today for expired project licence ${project.licenceNumber}`;

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });

    it('includes the relevant information in the email body', () => {
      const project = {
        id: uuid(),
        title: 'Email test',
        licenceHolderId: basic,
        expiryDate: moment().subtract(6, 'months').toISOString(),
        raDate: moment().toISOString(),
        status: 'expired',
        establishmentId: 8201,
        licenceNumber: 'XYZ12345'
      };

      return Promise.resolve()
        .then(() => this.schema.Project.query().insert(project))
        .then(() => this.schema.ProjectEstablishment.query().insert({ projectId: project.id, establishmentId: 123, status: 'active' }))
        .then(() => raDueNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          notifications.forEach(notification => {
            assert.ok(notification.html.includes(project.title));
            assert.ok(notification.html.includes(moment(project.raDate).format('D MMM YYYY')));
          });
        });
    });
  });

  describe('Revoked projects', () => {
    it('adds a notification for a revoked project due an RA in 3 months', () => {
      const project = {
        id: uuid(),
        licenceHolderId: basic,
        revocationDate: moment().subtract(3, 'months').toISOString(),
        raDate: moment().add(3, 'months').subtract(1, 'day').toISOString(),
        status: 'revoked',
        establishmentId: 8201,
        licenceNumber: 'XYZ12345'
      };

      return Promise.resolve()
        .then(() => this.schema.Project.query().insert(project))
        .then(() => this.schema.ProjectEstablishment.query().insert({ projectId: project.id, establishmentId: 123, status: 'active' }))
        .then(() => raDueNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expected = [
            'basic.user@example.com',
            'vice-chancellor@example.com',
            'croydon.admin@example.com'
          ];

          const expectedSubject = `Reminder: Retrospective assessment due in 3 months for revoked project licence ${project.licenceNumber}`;

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });

    it('adds a notification for a revoked project due an RA in 1 month', () => {
      const project = {
        id: uuid(),
        licenceHolderId: basic,
        revocationDate: moment().subtract(5, 'months').toISOString(),
        raDate: moment().add(1, 'months').subtract(1, 'day').toISOString(),
        status: 'revoked',
        establishmentId: 8201,
        licenceNumber: 'XYZ12345'
      };

      return Promise.resolve()
        .then(() => this.schema.Project.query().insert(project))
        .then(() => this.schema.ProjectEstablishment.query().insert({ projectId: project.id, establishmentId: 123, status: 'active' }))
        .then(() => raDueNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expected = [
            'basic.user@example.com',
            'vice-chancellor@example.com',
            'croydon.admin@example.com'
          ];

          const expectedSubject = `Reminder: Retrospective assessment due in 1 month for revoked project licence ${project.licenceNumber}`;

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });

    it('adds a notification for a revoked project due an RA today', () => {
      const project = {
        id: uuid(),
        licenceHolderId: basic,
        revocationDate: moment().subtract(6, 'months').toISOString(),
        raDate: moment().toISOString(),
        status: 'revoked',
        establishmentId: 8201,
        licenceNumber: 'XYZ12345'
      };

      return Promise.resolve()
        .then(() => this.schema.Project.query().insert(project))
        .then(() => this.schema.ProjectEstablishment.query().insert({ projectId: project.id, establishmentId: 123, status: 'active' }))
        .then(() => raDueNotice({ schema: this.schema, logger, publicUrl }))
        .then(() => this.schema.Notification.query())
        .then(notifications => {
          const expected = [
            'basic.user@example.com',
            'vice-chancellor@example.com',
            'croydon.admin@example.com'
          ];

          const expectedSubject = `Reminder: Retrospective assessment due today for revoked project licence ${project.licenceNumber}`;

          assert.equal(notifications.length, expected.length);
          assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
          notifications.forEach(notification => {
            assert.equal(notification.subject, expectedSubject);
          });
        });
    });
  });

  it('doesn\'t add an RA due notification for a project due an RA in 1 month but has submitted an RA', () => {
    const project = {
      id: uuid(),
      licenceHolderId: basic,
      expiryDate: moment().subtract(5, 'months').toISOString(),
      raDate: moment().add(1, 'months').subtract(1, 'day').toISOString(),
      status: 'expired',
      establishmentId: 8201,
      licenceNumber: 'XYZ12345',
      retrospectiveAssessments: [
        { data: {}, status: 'submitted' }
      ]
    };

    return Promise.resolve()
      .then(() => this.schema.Project.query().insertGraph(project))
      .then(() => raDueNotice({ schema: this.schema, logger, publicUrl }))
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        assert.equal(notifications.length, 0);
      });
  });

  it('doesn\'t add an RA due notification for a project due an RA in 1 month but has a granted RA', () => {
    const project = {
      id: uuid(),
      licenceHolderId: basic,
      expiryDate: moment().subtract(5, 'months').toISOString(),
      raDate: moment().add(1, 'months').subtract(1, 'day').toISOString(),
      status: 'expired',
      establishmentId: 8201,
      licenceNumber: 'XYZ12345',
      retrospectiveAssessments: [
        { data: {}, status: 'granted' }
      ]
    };

    return Promise.resolve()
      .then(() => this.schema.Project.query().insertGraph(project))
      .then(() => raDueNotice({ schema: this.schema, logger, publicUrl }))
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        assert.equal(notifications.length, 0);
      });
  });

  it('doesn\'t add an RA due notification for a project that has an overdue RA', () => {
    const project = {
      id: uuid(),
      licenceHolderId: basic,
      revocationDate: moment().subtract(7, 'months').toISOString(),
      raDate: moment().subtract(1, 'week').toISOString(),
      status: 'expired',
      establishmentId: 8201,
      licenceNumber: 'XYZ12345'
    };

    return Promise.resolve()
      .then(() => this.schema.Project.query().insert(project))
      .then(() => raDueNotice({ schema: this.schema, logger, publicUrl }))
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        assert.equal(notifications.length, 0);
      });
  });

});
