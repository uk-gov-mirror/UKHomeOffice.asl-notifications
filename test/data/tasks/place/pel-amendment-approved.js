module.exports = {
  id: '64a83ef9-8184-4f64-afad-96f74065313a',
  meta: {
    previous: 'with-inspectorate',
    next: 'inspector-recommended',
    user: {
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
  event: 'status:with-inspectorate:inspector-recommended',
  comment: 'Recommended',
  status: 'inspector-recommended',
  data: {
    data: {
      area: '18th Floor',
      name: '18.05',
      site: 'Lunar House',
      nacwo: '',
      holding: ['STH'],
      suitability: ['SA'],
      establishmentId: 8201
    },
    meta: { comments: 'New area', changesToRestrictions: null },
    model: 'place',
    action: 'create',
    changedBy: '5b7bad13-f34b-4959-bd08-c6067ae2fcdd',
    establishmentId: 8201
  }
};
