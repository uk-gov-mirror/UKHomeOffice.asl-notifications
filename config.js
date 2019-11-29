module.exports = {
  port: process.env.PORT || 8080,
  db: {
    database: process.env.DATABASE_NAME || 'asl',
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
  },
  emailer: process.env.EMAILER_SERVICE,
  publicUrl: process.env.PUBLIC_UI,
  notifications: {
    applicant: {
      status: [
        'with-licensing',
        'with-inspectorate',
        'referred-to-inspector',
        'inspector-recommended',
        'inspector-rejected',
        'resolved',
        'rejected',
        'returned-to-applicant',
        'awaiting-endorsement',
        'withdrawn-by-applicant'
      ],
      action: [
        'returned-to-applicant'
      ]
    },
    ntco: {
      action: [
        'awaiting-endorsement',
        'resolved'
      ]
    },
    outgoingNtco: {
      status: [
        'awaiting-endorsement',
        'resolved'
      ]
    }
  }
};
