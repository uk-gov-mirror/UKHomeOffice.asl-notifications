module.exports = {
  id: '64a83ef9-8184-4f64-afad-96f74065313a',
  meta: {
    previous: 'new',
    next: 'with-inspectorate',
    user: {
      id: '304cae96-0f56-492a-9f66-e99c2b3990c7',
      profile: {
        id: '5b7bad13-f34b-4959-bd08-c6067ae2fcdd',
        title: 'Dr',
        firstName: 'Bruce',
        lastName: 'Banner',
        email: 'vice-chancellor@example.com'
      }
    },
    payload: {
      data: {
        site: 'Lunar House',
        area: '18th Floor',
        name: '18.05',
        suitability: ['SA'],
        holding: ['STH'],
        nacwo: '',
        establishmentId: 8201
      },
      meta: { comments: 'New area', changesToRestrictions: null },
      model: 'place',
      action: 'create',
      changedBy: '5b7bad13-f34b-4959-bd08-c6067ae2fcdd'
    }
  },
  event: 'status:new:with-inspectorate',
  status: 'with-inspectorate',
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
