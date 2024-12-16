module.exports = {
  logLevel: process.env.LOG_LEVEL || 'info',
  port: process.env.PORT || 8080,
  db: {
    database: process.env.DATABASE_NAME || 'asl',
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'test-password',
    port: process.env.DATABASE_PORT || 5432
  },
  emailer: {
    host: process.env.EMAILER_SERVICE
  },
  publicUrl: process.env.PUBLIC_UI
};
