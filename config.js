module.exports = {
  port: process.env.PORT || 8080,
  db: {
    database: process.env.DATABASE_NAME || 'asl',
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USERNAME || 'postgres'
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
        'with-ntco',
        'withdrawn-by-applicant'
      ],
      action: [
        'returned-to-applicant'
      ]
    },
    ntco: {
      action: [
        'with-ntco'
      ]
    }
  }
};
