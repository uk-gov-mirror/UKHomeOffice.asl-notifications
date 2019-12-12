module.exports = models => {
  const { Establishment, Profile } = models;

  return Promise.resolve()
    .then(() => {
      return Establishment.query().insertGraph([
        {
          id: 8201,
          name: 'University of Croydon',
          status: 'active'
        },
        {
          id: 8202,
          name: 'Marvell Pharmaceutical',
          status: 'active'
        }
      ]);
    })
    .then(() => {
      return Profile.query().insertGraph([
        {
          id: '5b7bad13-f34b-4959-bd08-c6067ae2fcdd',
          title: 'Dr',
          firstName: 'Bruce',
          lastName: 'Banner',
          dob: '1970-04-23',
          email: 'vice-chancellor@example.com',
          establishments: [
            {
              id: 8201,
              role: 'admin'
            }
          ]
        },
        {
          id: '29b4ee99-fa8c-418d-ac80-3b45a5c26003',
          title: 'Prof.',
          firstName: 'Croydon',
          lastName: 'Admin',
          dob: '1972-07-11',
          email: 'vice-chancellor2@example.com',
          establishments: [
            {
              id: 8201,
              role: 'admin'
            }
          ]
        },
        {
          id: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
          title: 'Mr',
          firstName: 'Basic',
          lastName: 'User',
          dob: '1970-10-27',
          email: 'basic.user@example.com',
          establishments: [
            {
              id: 8201,
              role: 'basic'
            }
          ]
        }
      ],
      {
        relate: ['establishments']
      });
    });
};
