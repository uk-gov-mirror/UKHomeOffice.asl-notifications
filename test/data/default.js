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
          userId: '304cae96-0f56-492a-9f66-e99c2b3990c7',
          title: 'Dr',
          firstName: 'Bruce',
          lastName: 'Banner',
          dob: '1970-04-23',
          email: 'vice-chancellor@example.com',
          establishments: [
            {
              id: 8201,
              role: 'admin'
            },
            {
              id: 8202,
              role: 'admin'
            }
          ]
        },
        {
          id: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
          userId: 'f4c6fe14-15b4-403b-89e6-7e31913284c1',
          title: 'Mr',
          firstName: 'Basic',
          lastName: 'User',
          dob: '1970-10-27',
          email: 'basic.user@example.com',
          establishments: [
            {
              id: 8201,
              role: 'basic'
            },
            {
              id: 8202,
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
