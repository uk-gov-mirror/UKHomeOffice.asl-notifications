module.exports = {
  id: '70f7b6bc-14e9-4291-9b58-9f485f40c440',
  meta:
  {
    previous: 'referred-to-inspector',
    next: 'inspector-recommended',
    user:
    {
      id: '0c3679b6-730e-4ce0-a943-3f9694ab7e9b',
      profile: {
        id: '13381bbf-9ac2-4232-97f5-817b0aac9add',
        title: 'Dr',
        firstName: 'Inspector',
        lastName: 'Morse',
        email: 'asru-inspector@homeoffice.gov.uk'
      }
    },
    payload: {
      status: 'inspector-recommended',
      meta: { comment: 'Recommended' },
      changedBy: '13381bbf-9ac2-4232-97f5-817b0aac9add'
    }
  },
  event: 'status:referred-to-inspector:inspector-recommended',
  comment: 'Recommended',
  status: 'inspector-recommended',
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
