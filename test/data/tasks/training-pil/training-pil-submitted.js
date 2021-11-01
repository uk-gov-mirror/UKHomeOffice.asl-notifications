module.exports = {
  id: '0ec052e6-01b1-4438-9ef5-8d2188dc5f2b',
  meta: {
    previous: 'new',
    next: 'awaiting-endorsement',
    user: {
      profile: {
        id: '084457d6-0f38-43dd-b133-70858ff4b3de',
        title: 'Mr',
        firstName: 'Training',
        lastName: 'Course-owner',
        email: 't.course@example.com',
        asruUser: false,
        asruAdmin: false,
        asruLicensing: false,
        asruInspector: false,
        asruSupport: false,
        emailConfirmed: true,
        asruRops: false
      }
    },
    payload: {
      data: {
        firstName: 'Peter',
        lastName: 'Parker',
        email: 'p.parker@example.com',
        dob: '2000-01-01',
        trainingNeed: 'Needs training.',
        trainingCourseId: 'b081391c-123d-4639-8198-ec27b199f023',
        establishmentId: 54321
      },
      meta: {},
      model: 'trainingPil',
      establishmentId: 54321,
      action: 'create',
      changedBy: '084457d6-0f38-43dd-b133-70858ff4b3de'
    }
  },
  event: 'status:new:awaiting-endorsement',
  status: 'awaiting-endorsement',
  data: {
    id: '85076d2d-00de-4487-9749-a94ffe0445a8',
    data: {
      dob: '2000-01-01',
      email: 'p.parker@example.com',
      lastName: 'Parker',
      firstName: 'Peter',
      trainingNeed: 'Needs training.',
      establishmentId: 54321,
      trainingCourseId: 'b081391c-123d-4639-8198-ec27b199f023'
    },
    meta: {},
    model: 'trainingPil',
    action: 'grant',
    subject: '0c130d97-35f1-455f-b7db-a16ca0a7a2ea',
    changedBy: '084457d6-0f38-43dd-b133-70858ff4b3de',
    modelData: {
      id: '85076d2d-00de-4487-9749-a94ffe0445a8',
      status: 'inactive',
      profile: {
        id: '0c130d97-35f1-455f-b7db-a16ca0a7a2ea',
        dob: '2000-01-01',
        name: 'Peter Parker',
        email: 'p.parker@example.com',
        lastName: 'Parker',
        firstName: 'Peter',
        asruRops: false,
        asruUser: false,
        asruAdmin: false,
        asruSupport: false,
        trainingPils: [
          {
            id: '85076d2d-00de-4487-9749-a94ffe0445a8',
            status: 'inactive',
            deleted: null,
            createdAt: '2021-11-01T12:55:28.261Z',
            issueDate: null,
            profileId: '0c130d97-35f1-455f-b7db-a16ca0a7a2ea',
            updatedAt: '2021-11-01T12:55:28.261Z',
            expiryDate: null,
            trainingNeed: 'Needs training.',
            revocationDate: null,
            trainingCourse: {
              id: 'b081391c-123d-4639-8198-ec27b199f023',
              title: 'Training course to add participants to',
              deleted: null,
              project: {
                title: 'Training project 1',
                licenceNumber: 'PR250147'
              },
              species: [ 'Mice', 'Rats' ],
              createdAt: '2021-11-01T12:44:18.992Z',
              projectId: '56763107-6430-43a1-841d-ad2ecf4196ad',
              startDate: '2025-01-01',
              updatedAt: '2021-11-01T12:44:18.992Z',
              establishment: { name: 'Training Establishment' },
              establishmentId: 54321
            },
            trainingCourseId: 'b081391c-123d-4639-8198-ec27b199f023'
          }
        ],
        asruInspector: false,
        asruLicensing: false,
        certifications: null,
        emailConfirmed: false,
        qualifications: null,
        pilLicenceNumber: null
      },
      createdAt: '2021-11-01T12:55:28.261Z',
      issueDate: null,
      profileId: '0c130d97-35f1-455f-b7db-a16ca0a7a2ea',
      updatedAt: '2021-11-01T12:55:28.261Z',
      expiryDate: null,
      trainingNeed: 'Needs training.',
      revocationDate: null,
      trainingCourse: {
        id: 'b081391c-123d-4639-8198-ec27b199f023',
        title: 'Training course to add participants to',
        deleted: null,
        project: { title: 'Training project 1', licenceNumber: 'PR250147' },
        species: [ 'Mice', 'Rats' ],
        createdAt: '2021-11-01T12:44:18.992Z',
        projectId: '56763107-6430-43a1-841d-ad2ecf4196ad',
        startDate: '2025-01-01',
        updatedAt: '2021-11-01T12:44:18.992Z',
        establishment: { name: 'Training Establishment' },
        establishmentId: 54321
      },
      trainingCourseId: 'b081391c-123d-4639-8198-ec27b199f023'
    },
    establishmentId: 54321,
    initiatedByAsru: false
  },
  assignedTo: null,
  req: 'ec89460a-e17b-497c-8e95-be79b22b0b43'
};
