const {
  basic,
  croydonAdmin1,
  croydonAdmin2,
  croydonAdminUnsubscribed,
  croydonNtco,
  marvellAdmin,
  marvellAdminUnsubscribed,
  marvellNtco,
  research101Admin,
  research101Admin2,
  research101AdminUnsubscribed
} = require('../helpers/users');

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
        },
        {
          id: 101,
          name: 'Research 101',
          status: 'inactive'
        }
      ]);
    })
    .then(() => {
      return Profile.query().insertGraph([
        {
          id: croydonAdmin1,
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
          id: croydonAdmin2,
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
          id: croydonAdminUnsubscribed,
          title: 'Mr',
          firstName: 'Unsubscribed',
          lastName: 'CroydonAdmin',
          dob: '1966-11-04',
          email: 'unsubscribed-croydon@example.com',
          emailPreferences: {
            preferences: {
              'alerts-8201': []
            }
          },
          establishments: [
            {
              id: 8201,
              role: 'admin'
            }
          ]
        },
        {
          id: basic,
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
          id: croydonNtco,
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
          id: marvellNtco,
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
          id: marvellAdmin,
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
        },
        {
          id: marvellAdminUnsubscribed,
          title: 'Mr',
          firstName: 'Unsubscribed',
          lastName: 'MarvellAdmin',
          dob: '1966-11-04',
          email: 'unsubscribed-marvell@example.com',
          emailPreferences: {
            preferences: {
              'alerts-8202': []
            }
          },
          establishments: [
            {
              id: 8202,
              role: 'admin'
            }
          ]
        },
        {
          id: research101Admin,
          title: 'Dr',
          firstName: 'Lonni',
          lastName: 'Dorracott',
          dob: '1976-07-15',
          email: 'admin-research101@example.com',
          establishments: [
            {
              id: 101,
              role: 'admin'
            }
          ],
          roles: [
            {
              establishmentId: 101,
              type: 'pelh'
            }
          ]
        },
        {
          id: research101Admin2,
          title: 'Prof',
          firstName: 'Darb',
          lastName: 'Stell',
          dob: '1973-11-01',
          email: 'admin2-research101@example.com',
          establishments: [
            {
              id: 101,
              role: 'admin'
            }
          ],
          roles: [
            {
              establishmentId: 101,
              type: 'holc'
            }
          ]
        },
        {
          id: research101AdminUnsubscribed,
          title: 'Mr',
          firstName: 'Unsubscribed',
          lastName: 'Research101Admin',
          dob: '1966-11-04',
          email: 'unsubscribed-research101@example.com',
          emailPreferences: {
            preferences: {
              'alerts-101': []
            }
          },
          establishments: [
            {
              id: 101,
              role: 'admin'
            }
          ]
        }
      ],
      {
        relate: ['establishments']
      });
    });
};
