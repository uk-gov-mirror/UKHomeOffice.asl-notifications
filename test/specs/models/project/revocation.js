const assert = require('assert');
const moment = require('moment');
const dbHelper = require('../../../helpers/db');
const logger = require('../../../helpers/logger');
const Recipients = require('../../../../lib/recipients');
const { basic, collaborator, collaboratorUnsubscribed } = require('../../../helpers/users');

const {
  projectRevocation
} = require('../../../data/tasks');

describe('Project revocations', () => {

  before(() => {
    this.schema = dbHelper.init();
    this.recipientBuilder = Recipients({ schema: this.schema, logger });
  });

  beforeEach(() => {
    return dbHelper.reset(this.schema)
      .then(() => dbHelper.loadFixtures(this.schema))
      .then(() => {
        return this.schema.Project.query().insert(projectRevocation.data.modelData);
      })
      .then(project => {
        return this.schema.ProjectProfile.query().insert([
          { projectId: project.id, profileId: collaborator },
          { projectId: project.id, profileId: collaboratorUnsubscribed }
        ]);
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

  describe('Project collaborators', () => {

    it('notifies all subscribed collaborators when the project is revoked', () => {
      return this.recipientBuilder.getNotifications(projectRevocation)
        .then(recipients => {
          assert(recipients.has(collaborator), 'collaborator is in the recipients list');
          assert(recipients.get(collaborator).emailTemplate === 'ppl-revoked', 'email type is ppl-revoked');
          assert(recipients.get(collaborator).applicant.id === basic, 'basic user is the applicant');
          assert(!recipients.has(collaboratorUnsubscribed), 'collaboratorUnsubscribed is not in the recipients list');
        });
    });

  });

});
