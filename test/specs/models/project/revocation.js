const assert = require('assert');
const moment = require('moment');
const dbHelper = require('../../../helpers/db');
const logger = require('../../../helpers/logger');
const Recipients = require('../../../../lib/recipients');
const { basic } = require('../../../helpers/users');

const {
  projectRevocation
} = require('../../../data/tasks');

describe('Project applications', () => {

  before(() => {
    this.schema = dbHelper.init();
    this.recipientBuilder = Recipients({ schema: this.schema, logger });
  });

  beforeEach(() => {
    return dbHelper.reset()
      .then(() => dbHelper.loadFixtures(this.schema))
      .then(() => {
        return this.schema.Project.query().insert(projectRevocation.data.modelData);
      });
  });

  after(() => {
    return this.schema.destroy();
  });

  describe('Licence Holder', () => {

    it('notifies the licence holder when their project is revoked', () => {
      return this.recipientBuilder.getNotifications(projectRevocation)
        .then(recipients => {
          assert(recipients.has(basic), 'basic user is in the recipients list');
          assert.equal(recipients.get(basic).emailTemplate, 'ppl-revoked');
          assert.equal(recipients.get(basic).applicant.id, basic);
        });
    });

    it('includes the publications date in the email', () => {
      const expected = moment(projectRevocation.data.modelData.revocationDate).add(6, 'months').format('D MMM YYYY');
      return this.recipientBuilder.getNotifications(projectRevocation)
        .then(recipients => {
          assert.equal(recipients.get(basic).publicationsDate, expected);
        });
    });

    it('includes the ROP due date in the email', () => {
      const expected = moment(projectRevocation.data.modelData.revocationDate).add(28, 'days').format('D MMM YYYY');
      return this.recipientBuilder.getNotifications(projectRevocation)
        .then(recipients => {
          assert.equal(recipients.get(basic).ropsDate, expected);
        });
    });

  });

});
