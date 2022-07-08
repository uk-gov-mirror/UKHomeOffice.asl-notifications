const assert = require('assert');
const dbHelper = require('../../../helpers/db');
const logger = require('../../../helpers/logger');
const Recipients = require('../../../../lib/recipients');
const { trainingOwner, trainingLicenceHolder, trainingNtco, trainingAdmin } = require('../../../helpers/users');

const {
  trainingPilSubmitted,
  trainingPilEndorsed,
  trainingPilReturned,
  trainingPilRejected,
  trainingPilGranted
} = require('../../../data/tasks');

describe('Training PIL applications', () => {

  before(() => {
    this.schema = dbHelper.init();
    this.recipientBuilder = Recipients({ schema: this.schema, logger, publicUrl: 'http://localhost' });
  });

  beforeEach(() => {
    return dbHelper.reset(this.schema)
      .then(() => dbHelper.loadFixtures(this.schema))
      .then(() => {
        return this.schema.Project.query().insert({
          id: '56763107-6430-43a1-841d-ad2ecf4196ad',
          establishmentId: 54321,
          title: 'Training project 1',
          licenceNumber: 'PR250147',
          status: 'active',
          schemaVersion: 1,
          licenceHolderId: trainingOwner
        });
      })
      .then(() => {
        return this.schema.TrainingCourse.query().insertGraph({
          id: 'b081391c-123d-4639-8198-ec27b199f023',
          title: 'Training course to add participants to',
          species: [ 'Mice', 'Rats' ],
          startDate: '2025-01-01',
          establishmentId: 54321,
          projectId: '56763107-6430-43a1-841d-ad2ecf4196ad',
          trainingPils: [
            {
              id: '85076d2d-00de-4487-9749-a94ffe0445a8',
              status: 'inactive',
              trainingNeed: 'Needs training.',
              profileId: trainingLicenceHolder
            }
          ]
        });
      });
  });

  after(() => {
    return this.schema.destroy();
  });

  describe('Course owner', () => {

    it('notifies the course owner when a new application is submitted', () => {
      return this.recipientBuilder.getNotifications(trainingPilSubmitted)
        .then(recipients => {
          assert(recipients.has(trainingOwner), 'training course owner is in the recipients list');
          assert(recipients.get(trainingOwner).emailTemplate === 'task-opened');
          assert(recipients.get(trainingOwner).applicant.id === trainingLicenceHolder, 'licence holder is the applicant');
          assert(!recipients.has(trainingLicenceHolder), 'licence holder is not in the recipients list');
        });
    });

    it('notifies the course owner when the application is returned by asru', () => {
      return this.recipientBuilder.getNotifications(trainingPilReturned)
        .then(recipients => {
          assert(recipients.has(trainingOwner), 'training course owner is in the recipients list');
          assert(recipients.get(trainingOwner).emailTemplate === 'task-action-required');
          assert(!recipients.has(trainingLicenceHolder), 'licence holder is not in the recipients list');
        });
    });

    it('does not notify the course owner when the application is endorsed by the ntco', () => {
      return this.recipientBuilder.getNotifications(trainingPilEndorsed)
        .then(recipients => {
          assert.strictEqual(recipients.size, 0, 'training pil endorsements do not create notifications');
        });
    });

    it('notifies the course owner when the application is granted', () => {
      return this.recipientBuilder.getNotifications(trainingPilGranted)
        .then(recipients => {
          assert(recipients.has(trainingOwner), 'training course owner is in the recipients list');
          assert(recipients.get(trainingOwner).emailTemplate === 'training-pil-granted');
          assert(!recipients.has(trainingLicenceHolder), 'licence holder is not in the recipients list');
        });
    });

    it('notifies the course owner when the application is rejected', () => {
      return this.recipientBuilder.getNotifications(trainingPilRejected)
        .then(recipients => {
          assert(recipients.has(trainingOwner), 'training course owner is in the recipients list');
          assert(recipients.get(trainingOwner).emailTemplate === 'training-pil-rejected');
          assert(!recipients.has(trainingLicenceHolder), 'licence holder is not in the recipients list');
        });
    });

  });

  describe('Establishment NTCOs', () => {

    it('notifies all NTCOs at the establishment when a new application is awaiting endorsement', () => {
      return this.recipientBuilder.getNotifications(trainingPilSubmitted)
        .then(recipients => {
          assert(recipients.has(trainingNtco), 'trainingNtco is in the recipients list');
          assert(recipients.get(trainingNtco).emailTemplate === 'task-action-required');
          assert(recipients.get(trainingOwner).applicant.id === trainingLicenceHolder, 'licence holder is the applicant');
        });
    });

    it('notifies all NTCOs when the application is granted', () => {
      return this.recipientBuilder.getNotifications(trainingPilGranted)
        .then(recipients => {
          assert(recipients.has(trainingNtco), 'croydonNtco is in the recipients list');
          assert(recipients.get(trainingNtco).emailTemplate === 'training-pil-granted');
        });
    });

    it('notifies all NTCOs when the application is rejected', () => {
      return this.recipientBuilder.getNotifications(trainingPilRejected)
        .then(recipients => {
          assert(recipients.has(trainingNtco), 'croydonNtco is in the recipients list');
          assert(recipients.get(trainingNtco).emailTemplate === 'training-pil-rejected');
        });
    });

  });

  describe('Establishment admins', () => {

    it('does not notify admins at the establishment when a new application is submitted', () => {
      return this.recipientBuilder.getNotifications(trainingPilSubmitted)
        .then(recipients => {
          assert(!recipients.has(trainingAdmin), 'trainingAdmin is not in the recipients list');
        });
    });

    it('notifies all subscribed admins at the establishment when the application is granted', () => {
      return this.recipientBuilder.getNotifications(trainingPilGranted)
        .then(recipients => {
          assert(recipients.has(trainingAdmin), 'trainingAdmin is in the recipients list');
          assert(recipients.get(trainingAdmin).emailTemplate === 'training-pil-granted');
          assert(recipients.get(trainingAdmin).applicant.id === trainingLicenceHolder, 'licence holder is the applicant');
        });
    });

    it('notifies all subscribed admins at the establishment when the application is rejected', () => {
      return this.recipientBuilder.getNotifications(trainingPilRejected)
        .then(recipients => {
          assert(recipients.has(trainingAdmin), 'trainingAdmin is in the recipients list');
          assert(recipients.get(trainingAdmin).emailTemplate === 'training-pil-rejected');
        });
    });

  });

});
