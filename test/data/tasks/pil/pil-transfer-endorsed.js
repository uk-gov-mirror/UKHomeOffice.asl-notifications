module.exports = {
  id: '70f7b6bc-14e9-4291-9b58-9f485f40c440',
  meta: {
    previous: 'endorsed',
    next: 'with-licensing',
    user: {
      id: '8b45c5cc-1f33-4cb6-82d2-a049a9a7b192',
      profile: {
        id: 'd5f9d6b7-ad6b-4616-9e55-2fa92bfd9926',
        title: 'Dr',
        firstName: 'Jason',
        lastName: 'Alden',
        email: 'abc8@example.com'
      }
    },
    payload: {
      status: 'endorsed',
      meta: { comment: 'Endorsed' },
      changedBy: 'd5f9d6b7-ad6b-4616-9e55-2fa92bfd9926'
    }
  },
  event: 'status:endorsed:with-licensing',
  comment: 'Endorsed',
  status: 'with-licensing',
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
