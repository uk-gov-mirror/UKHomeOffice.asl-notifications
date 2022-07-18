const { v4: uuid } = require('uuid');
const sinon = require('sinon');
const moment = require('moment');
const assert = require('assert');
const dbHelper = require('../../helpers/db');
const logger = require('../../helpers/logger');
const reviewNotice = require('../../../jobs/pil-review-notice');
const { basic } = require('../../helpers/users');

const publicUrl = 'http://localhost:8080';

describe('PIL review', () => {

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

  it('3 month notification to the licence holder for a PIL due a review in 3 months', () => {
    const pil = {
      id: uuid(),
      profileId: basic,
      reviewDate: moment().add(3, 'months').subtract(1, 'day').toISOString(),
      status: 'active',
      establishmentId: 8201,
      licenceNumber: 'PIL-3-MONTH'
    };

    return Promise.resolve()
      .then(() => this.schema.PIL.query().insert(pil))
      .then(() => reviewNotice({ schema: this.schema, logger, publicUrl }))
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        const expected = ['basic.user@example.com'];
        const expectedSubject = `Reminder: personal licence ${pil.licenceNumber} is due a review in 3 months`;

        assert.equal(notifications.length, expected.length);
        assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
        notifications.forEach(notification => {
          assert.equal(notification.subject, expectedSubject);
        });
      });
  });

  it('1 month notification to the licence holder for a PIL due a review in 1 month', () => {
    const pil = {
      id: uuid(),
      profileId: basic,
      reviewDate: moment().add(1, 'months').subtract(1, 'day').toISOString(),
      status: 'active',
      establishmentId: 8201,
      licenceNumber: 'PIL-1-MONTH'
    };

    return Promise.resolve()
      .then(() => this.schema.PIL.query().insert(pil))
      .then(() => reviewNotice({ schema: this.schema, logger, publicUrl }))
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        const expected = ['basic.user@example.com'];
        const expectedSubject = `Reminder: personal licence ${pil.licenceNumber} is due a review in 1 month`;

        assert.equal(notifications.length, expected.length);
        assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
        notifications.forEach(notification => {
          assert.equal(notification.subject, expectedSubject);
        });
      });
  });

  it('review overdue notification to the licence holder and NTCOs for a PIL review required in the last week', () => {
    const pil = {
      id: uuid(),
      profileId: basic,
      reviewDate: moment().subtract(4, 'day').toISOString(),
      status: 'active',
      establishmentId: 8201,
      licenceNumber: 'PIL-OVERDUE'
    };

    return Promise.resolve()
      .then(() => this.schema.PIL.query().insert(pil))
      .then(() => reviewNotice({ schema: this.schema, logger, publicUrl }))
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        const expected = [
          'basic.user@example.com',
          'ntco@example.com'
        ];
        const expectedSubject = `Important: personal licence ${pil.licenceNumber} is overdue a review`;

        assert.equal(notifications.length, expected.length);
        assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
        notifications.forEach(notification => {
          assert.equal(notification.subject, expectedSubject);
        });
      });
  });

  it('doesn\'t add a review overdue notification for reviews due over a week ago', () => {
    const pil = {
      id: uuid(),
      profileId: basic,
      reviewDate: moment().subtract(2, 'weeks').toISOString(),
      status: 'active',
      establishmentId: 8201,
      licenceNumber: 'PIL-VERY-OVERDUE'
    };

    return Promise.resolve()
      .then(() => this.schema.PIL.query().insert(pil))
      .then(() => reviewNotice({ schema: this.schema, logger, publicUrl }))
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        assert.equal(notifications.length, 0);
      });
  });

  it('adds review notifications for all PILs due a review, ignoring ones already added', () => {
    const ids = {
      reviewIn6Months: uuid(),
      reviewIn3Months: uuid(),
      reviewIn1Month: uuid(),
      reviewOverdue: uuid(),
      reviewVeryOverdue: uuid(),
      alreadyNotified: uuid()
    };
    const pils = [
      {
        id: ids.reviewIn6Months,
        profileId: basic,
        reviewDate: moment().add(6, 'months').subtract(1, 'day').toISOString(),
        status: 'active',
        establishmentId: 8201,
        licenceNumber: 'PIL-6-MONTH'
      },
      {
        id: ids.reviewIn3Months,
        profileId: basic,
        reviewDate: moment().add(3, 'months').subtract(1, 'day').toISOString(),
        status: 'active',
        establishmentId: 8201,
        licenceNumber: 'PIL-3-MONTH'
      },
      {
        id: ids.reviewIn1Month,
        profileId: basic,
        reviewDate: moment().add(1, 'months').subtract(1, 'day').toISOString(),
        status: 'active',
        establishmentId: 8201,
        licenceNumber: 'PIL-1-MONTH'
      },
      {
        id: ids.reviewOverdue,
        profileId: basic,
        reviewDate: moment().subtract(1, 'day').toISOString(),
        status: 'active',
        establishmentId: 8201,
        licenceNumber: 'PIL-OVERDUE'
      },
      {
        id: ids.reviewVeryOverdue,
        profileId: basic,
        reviewDate: moment().subtract(1, 'month').toISOString(),
        status: 'active',
        establishmentId: 8201,
        licenceNumber: 'PIL-VERY-OVERDUE'
      }
    ];

    const alreadyNotified = {
      id: ids.alreadyNotified,
      profileId: basic,
      reviewDate: moment().add(1, 'months').subtract(1, 'day').toISOString(),
      status: 'active',
      establishmentId: 8201,
      licenceNumber: 'PIL-NOTIFIED'
    };

    return Promise.resolve()
      .then(() => this.schema.PIL.query().insert(alreadyNotified))
      .then(() => reviewNotice({ schema: this.schema, logger, publicUrl }))
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        assert.equal(notifications.length, 1);
      })
      .then(() => this.schema.PIL.query().insert(pils))
      .then(() => reviewNotice({ schema: this.schema, logger, publicUrl }))
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        const sixMonths = notifications.filter(n => n.identifier.includes(ids.reviewIn6Months));
        assert.deepStrictEqual(sixMonths.length, 0, 'there should be no notifications 6 months out');

        const threeMonths = notifications.filter(n => n.identifier.includes(ids.reviewIn3Months));
        assert.deepStrictEqual(threeMonths.length, 1, 'there should be a 3 month notification to the licence holder');

        const oneMonth = notifications.filter(n => n.identifier.includes(ids.reviewIn1Month));
        assert.deepStrictEqual(oneMonth.length, 1, 'there should be a 1 month notification to the licence holder');

        const overdue = notifications.filter(n => n.identifier.includes(ids.reviewOverdue));
        assert.deepStrictEqual(overdue.length, 2, 'there should be an overdue notification to the licence holder and NTCO');

        const alreadyNotified = notifications.filter(n => n.identifier.includes(ids.alreadyNotified));
        assert.deepStrictEqual(alreadyNotified.length, 1, 'review should be notified only once per time period');
      });
  });

});
