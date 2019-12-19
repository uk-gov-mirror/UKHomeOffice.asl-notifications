module.exports = {
  id: '70f7b6bc-14e9-4291-9b58-9f485f40c440',
  meta: {
    previous: 'new',
    next: 'awaiting-endorsement',
    user: {
      id: 'f4c6fe14-15b4-403b-89e6-7e31913284c1',
      profile: {
        id: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
        title: 'Mr',
        firstName: 'Basic',
        lastName: 'User',
        email: 'basic.user@example.com',
        name: 'Basic User'
      }
    },
    payload: {
      data: {
        procedures: ['A', 'B'],
        notesCatD: '',
        notesCatF: '',
        species: ['Mice', 'Rats'],
        establishment: {
          from: { id: 8201, name: 'University of Croydon' },
          to: { id: 8202, name: 'Marvell Pharmaceutical' }
        },
        establishmentId: 8202,
        profileId: '304235c0-1a83-49f0-87ca-b11b1ad1e147'
      },
      meta: {},
      model: 'pil',
      id: '8ba20f04-2542-43d5-81cd-6011b30baf5a',
      action: 'transfer',
      changedBy: '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    }
  },
  event: 'status:new:awaiting-endorsement',
  status: 'awaiting-endorsement',
  data: {
    id: '8ba20f04-2542-43d5-81cd-6011b30baf5a',
    data: {
      species: ['Mice', 'Rats'],
      notesCatD: '',
      notesCatF: '',
      profileId: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      procedures: ['A', 'B'],
      establishment: {
        to: { id: 8202, name: 'Marvell Pharmaceutical' },
        from: { id: 8201, name: 'University of Croydon' }
      },
      establishmentId: 8202
    },
    meta: {},
    model: 'pil',
    action: 'transfer',
    subject: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
    changedBy: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
    modelData: {
      id: '8ba20f04-2542-43d5-81cd-6011b30baf5a',
      status: 'active',
      deleted: null,
      species: ['Mice', 'Rats'],
      createdAt: '2019-12-13T16:55:22.296Z',
      issueDate: '2019-12-13T17:36:04.060Z',
      notesCatD: '',
      notesCatF: '',
      profileId: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      updatedAt: '2019-12-13T17:36:04.060Z',
      conditions: null,
      migratedId: null,
      procedures: ['A', 'B'],
      reviewDate: null,
      licenceNumber: 'I25828679',
      revocationDate: null,
      establishmentId: 8201
    },
    establishmentId: 8202
  }
};
