module.exports = {
  id: '4a454093-b060-46d7-b678-a82d6d81ae2f',
  meta: {
    previous: 'inspector-recommended',
    next: 'rejected',
    user: {
      id: '0c3679b6-730e-4ce0-a943-3f9694ab7e9b',
      profile: {
        id: '40a05ddd-aab1-4922-ae8f-31d4ec25457d',
        title: 'Dr',
        firstName: 'Inspector',
        lastName: 'Morse',
        email: 'asru-inspector@homeoffice.gov.uk',
        asruUser: true,
        asruAdmin: false,
        asruLicensing: false,
        asruInspector: true,
        roles: [],
        establishments: [],
        asru: [],
        name: 'Inspector Morse'
      }
    },
    payload: {
      status: 'rejected',
      meta: { comment: 'Rejected' },
      changedBy: '6d27a787-f72a-49d2-bcdb-9cbc42f8f124'
    }
  },
  event: 'status:inspector-recommended:rejected',
  comment: 'Rejected',
  status: 'rejected',
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
