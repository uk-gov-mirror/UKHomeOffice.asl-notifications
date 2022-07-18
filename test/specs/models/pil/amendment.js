const assert = require('assert');
const dbHelper = require('../../../helpers/db');
const logger = require('../../../helpers/logger');
const Recipients = require('../../../../lib/recipients');
const { basic, croydonAdmin1, croydonAdmin2, croydonAdminUnsubscribed, croydonNtco } = require('../../../helpers/users');

const { pilAmendmentAsru } = require('../../../data/tasks');

describe('PIL amendments', () => {

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

  describe('ASRU Licensing Officer', () => {

    it('notifies the licence holder, ntco and subscribed establishment admins when ASRU amends a PIL', () => {
      return this.recipientBuilder.getNotifications(pilAmendmentAsru)
        .then(recipients => {
          assert(recipients.has(basic), 'basic user is in the recipients list');
          assert.equal(recipients.get(basic).emailTemplate, 'licence-granted', 'email type is licence-granted');
          assert.equal(recipients.get(basic).applicant.id, basic, 'basic user is the applicant');

          assert(recipients.has(croydonAdmin1), 'croydonAdmin1 is in the recipients list');
          assert.equal(recipients.get(croydonAdmin1).emailTemplate, 'licence-granted', 'email type is licence-granted');
          assert.equal(recipients.get(croydonAdmin1).applicant.id, basic, 'basic user is the applicant');

          assert(recipients.has(croydonAdmin2), 'croydonAdmin2 is in the recipients list');
          assert.equal(recipients.get(croydonAdmin2).emailTemplate, 'licence-granted', 'email type is licence-granted');
          assert.equal(recipients.get(croydonAdmin2).applicant.id, basic, 'basic user is the applicant');

          assert(recipients.has(croydonNtco), 'croydonNtco is in the recipients list');
          assert.equal(recipients.get(croydonNtco).emailTemplate, 'licence-granted', 'email type is licence-granted');
          assert.equal(recipients.get(croydonNtco).applicant.id, basic, 'basic user is the applicant');

          assert(!recipients.has(croydonAdminUnsubscribed), 'croydonAdminUnsubscribed is not in the recipients list');
        });
    });

  });

});
