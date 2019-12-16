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
          ],
          roles: [
            {
              establishmentId: 8201,
              type: 'holc'
            },
            {
              establishmentId: 8201,
              type: 'pelh'
            }
          ]
        },
        {
          id: '29b4ee99-fa8c-418d-ac80-3b45a5c26003',
          title: 'Prof.',
          firstName: 'Croydon',
          lastName: 'Admin',
          dob: '1972-07-11',
          email: 'croydon.admin@example.com',
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
            },
            {
              id: 8202,
              role: 'basic'
            }
          ]
        },
        {
          id: '0b2d1c52-f8e4-4d16-b58c-0ce80ca58d0c',
          title: 'Dr',
          firstName: 'Neil',
          lastName: 'Down',
          dob: '1962-07-19',
          email: 'ntco@example.com',
          establishments: [
            {
              id: 8201,
              role: 'basic'
            }
          ],
          roles: [
            {
              establishmentId: 8201,
              type: 'ntco'
            }
          ]
        },
        {
          id: '133a1e2b-65d2-4b49-a372-d2e7bd5c50ea',
          title: 'Dr',
          firstName: 'Jason',
          lastName: 'Alden',
          dob: '1981-11-02',
          email: 'ntco-marvell@example.com',
          establishments: [
            {
              id: 8202,
              role: 'basic'
            }
          ],
          roles: [
            {
              establishmentId: 8202,
              type: 'ntco'
            }
          ]
        },
        {
          id: '45468f63-56e5-46d2-9306-eebc3b2c20d9',
          title: 'Prof',
          firstName: 'Arv',
          lastName: 'Petrillo',
          dob: '1976-09-21',
          email: 'admin-marvell@example.com',
          establishments: [
            {
              id: 8202,
              role: 'admin'
            }
          ],
          roles: [
            {
              establishmentId: 8202,
              type: 'holc'
            },
            {
              establishmentId: 8202,
              type: 'pelh'
            }
          ]
        }
      ],
      {
        relate: ['establishments']
      });
    });
};
