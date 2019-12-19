module.exports = {
  id: '6073fb2d-e1ef-48ad-ab71-3a7cb47a17dd',
  meta: {
    previous: 'new',
    next: 'with-inspectorate',
    user: {
      id: 'f4c6fe14-15b4-403b-89e6-7e31913284c1',
      profile: {
        id: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
        title: 'Mr',
        firstName: 'Basic',
        lastName: 'User',
        dob: '1970-10-27',
        email: 'basic.user@example.com'
      }
    },
    payload: {
      data: {
        firstName: 'Advanced',
        lastName: 'User',
        dob: '1970-10-27',
        telephone: ''
      },
      meta: { comments: 'Name change' },
      model: 'profile',
      id: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      action: 'update',
      changedBy: '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    }
  },
  event: 'status:new:with-inspectorate',
  status: 'with-inspectorate',
  data: {
    id: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
    data: {
      dob: '1970-10-27',
      lastName: 'User',
      firstName: 'Advanced',
      telephone: ''
    },
    meta: { comments: 'Name change' },
    model: 'profile',
    action: 'update',
    subject: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
    changedBy: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
    modelData: {
      id: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      dob: '1970-10-27',
      name: 'Basic User',
      email: 'basic.user@example.com',
      notes: null,
      title: 'Mr',
      userId: 'f4c6fe14-15b4-403b-89e6-7e31913284c1',
      address: null,
      deleted: null,
      asruUser: false,
      lastName: 'User',
      position: null,
      postcode: null,
      asruAdmin: false,
      createdAt: '2019-12-13T16:54:46.748Z',
      firstName: 'Basic',
      telephone: null,
      updatedAt: '2019-12-13T16:54:46.748Z',
      migratedId: null,
      asruInspector: false,
      asruLicensing: false,
      certifications: null,
      qualifications: null
    }
  }
};
