module.exports = {
  id: '0ec052e6-01b1-4438-9ef5-8d2188dc5f2b',
  meta: {
    previous: 'endorsed',
    next: 'with-inspectorate',
    user: {
      id: '2915d6ea-bf8f-4194-ba4e-c067b8adc5e6',
      profile: {
        id: 'ca77cd58-ec4a-417f-8fd2-7dca63698c0e',
        migratedId: null,
        userId: '2915d6ea-bf8f-4194-ba4e-c067b8adc5e6',
        title: 'Mr',
        firstName: 'Training',
        lastName: 'NTCO',
        dob: '1980-01-02',
        position: null,
        qualifications: null,
        certifications: null,
        address: null,
        postcode: null,
        email: 'trainingntco@example.com',
        telephone: null,
        notes: null,
        createdAt: '2021-11-01T12:44:18.069Z',
        updatedAt: '2021-11-01T12:44:18.069Z',
        deleted: null,
        asruUser: false,
        asruAdmin: false,
        asruLicensing: false,
        asruInspector: false,
        asruSupport: false,
        telephoneAlt: null,
        pilLicenceNumber: null,
        rcvsNumber: null,
        emailConfirmed: true,
        lastLogin: '2021-11-01T12:59:38.278Z',
        asruRops: false,
        roles: [
          {
            id: '8216ddad-319f-4179-afc9-d3637f9c13ca',
            migratedId: null,
            type: 'ntco',
            establishmentId: 54321,
            profileId: 'ca77cd58-ec4a-417f-8fd2-7dca63698c0e',
            createdAt: '2021-11-01T12:44:18.071Z',
            updatedAt: '2021-11-01T12:44:18.071Z',
            deleted: null
          }
        ],
        establishments: [
          {
            id: 54321,
            migratedId: null,
            name: 'Training Establishment',
            type: null,
            status: 'active',
            issueDate: '2018-07-05T12:00:00.000Z',
            revocationDate: null,
            licenceNumber: 'XCC09J64E',
            country: 'england',
            address: null,
            email: null,
            procedure: false,
            breeding: false,
            supplying: false,
            killing: false,
            rehomes: false,
            conditions: null,
            createdAt: '2017-05-11T12:00:00.000Z',
            updatedAt: '2017-05-11T12:00:00.000Z',
            deleted: null,
            company: null,
            sharedKey: null,
            billing: null,
            isTrainingEstablishment: true,
            keywords: null,
            cjsmEmail: null,
            role: 'basic'
          }
        ],
        name: 'Training NTCO'
      }
    },
    payload: {
      status: 'endorsed',
      meta: {
        comment: '',
        declaration: 'By endorsing this application, I agree that:\n' +
          '* Peter Parker will receive all relevant training before carrying out regulated procedures on protected animals as part of this course.\n' +
          "* I have the authority of the establishment licence holder and they are aware they will be liable for the licence's cost."
      },
      changedBy: 'ca77cd58-ec4a-417f-8fd2-7dca63698c0e'
    }
  },
  event: 'status:endorsed:with-inspectorate',
  comment: '',
  status: 'with-inspectorate',
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
      deleted: null,
      profile: {
        id: '0c130d97-35f1-455f-b7db-a16ca0a7a2ea',
        dob: '2000-01-01',
        pil: null,
        name: 'Peter Parker',
        email: 'p.parker@example.com',
        notes: null,
        title: null,
        userId: null,
        address: null,
        deleted: null,
        asruRops: false,
        asruUser: false,
        lastName: 'Parker',
        position: null,
        postcode: null,
        asruAdmin: false,
        createdAt: '2021-11-01T12:55:28.261Z',
        firstName: 'Peter',
        lastLogin: null,
        telephone: null,
        updatedAt: '2021-11-01T12:55:28.261Z',
        migratedId: null,
        rcvsNumber: null,
        asruSupport: false,
        telephoneAlt: null,
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
  req: 'b4d67e19-df9d-4136-a236-ffafc62dfe46'
};
