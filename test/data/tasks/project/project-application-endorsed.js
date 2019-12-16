module.exports = {
  id: '4a454093-b060-46d7-b678-a82d6d81ae2f',
  meta: {
    previous: 'endorsed',
    next: 'with-inspectorate',
    user: {
      id: '304cae96-0f56-492a-9f66-e99c2b3990c7',
      profile: {
        id: '5b7bad13-f34b-4959-bd08-c6067ae2fcdd',
        title: 'Dr',
        firstName: 'Bruce',
        lastName: 'Banner',
        email: 'vice-chancellor@example.com',
        asruUser: false,
        asruAdmin: false,
        asruLicensing: false,
        asruInspector: false,
        roles: [{
          id: '57c355d5-70b2-463e-9620-62aa5ad562c9',
          migratedId: null,
          type: 'pelh',
          establishmentId: 8201,
          profileId: '5b7bad13-f34b-4959-bd08-c6067ae2fcdd',
          createdAt: '2019-12-12T12:49:31.737Z',
          updatedAt: '2019-12-12T12:49:31.737Z',
          deleted: null
        },
        {
          id: '7d85d812-22f6-4cef-bc3b-b3cb9f83d5ce',
          migratedId: null,
          type: 'holc',
          establishmentId: 8201,
          profileId: '5b7bad13-f34b-4959-bd08-c6067ae2fcdd',
          createdAt: '2019-12-12T12:49:31.737Z',
          updatedAt: '2019-12-12T12:49:31.737Z',
          deleted: null
        },
        {
          id: 'd6b749b3-896d-40b8-917a-569e81a51bdd',
          migratedId: null,
          type: 'nprc',
          establishmentId: 8202,
          profileId: '5b7bad13-f34b-4959-bd08-c6067ae2fcdd',
          createdAt: '2019-12-12T12:49:31.740Z',
          updatedAt: '2019-12-12T12:49:31.740Z',
          deleted: null
        }],
        establishments: [{
          id: 8201,
          migratedId: '8201',
          name: 'University of Croydon',
          status: 'active',
          role: 'admin'
        },
        {
          id: 8202,
          migratedId: '8202',
          name: 'Marvell Pharmaceutical',
          status: 'active',
          role: 'admin'
        }],
        asru: [],
        name: 'Bruce Banner'
      }
    },
    payload: {
      status: 'endorsed',
      meta: { comment: 'Go' },
      changedBy: '5b7bad13-f34b-4959-bd08-c6067ae2fcdd'
    }
  },
  event: 'status:endorsed:with-inspectorate',
  comment: 'Go',
  status: 'with-inspectorate',
  data: {
    id: '44ca3d4b-dedf-43e1-a6b7-12eb3cfb249b',
    data: {
      version: '6e237195-d206-48f7-955e-46edc244cb4c',
      establishmentId: 8201,
      licenceHolderId: '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    },
    meta: {
      awerb: 'Not yet',
      ready: 'No',
      version: '6e237195-d206-48f7-955e-46edc244cb4c',
      authority: 'Yes'
    },
    model: 'project',
    action: 'grant',
    subject: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
    changedBy: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
    modelData: {
      id: '44ca3d4b-dedf-43e1-a6b7-12eb3cfb249b',
      title: 'My first project',
      status: 'inactive',
      deleted: null,
      createdAt: '2019-12-12T15:20:00.251Z',
      issueDate: null,
      updatedAt: '2019-12-12T15:20:32.191Z',
      expiryDate: null,
      migratedId: null,
      amendedDate: null,
      licenceNumber: null,
      schemaVersion: 1,
      revocationDate: null,
      establishmentId: 8201,
      licenceHolderId: '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    },
    establishmentId: 8201
  }
};
