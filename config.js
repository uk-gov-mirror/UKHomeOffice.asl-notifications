module.exports = {
  port: process.env.PORT || 8087,
  db: {
    database: process.env.DATABASE_NAME || 'asl',
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USERNAME || 'postgres'
  },
  emailer: {
    host: process.env.EMAILER_SERVICE
  }
};
