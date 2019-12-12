module.exports = {
  logLevel: process.env.LOG_LEVEL || 'info',
  port: process.env.PORT || 8080,
  db: {
    database: process.env.DATABASE_NAME || 'asl',
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
  },
  emailer: {
    host: process.env.EMAILER_SERVICE
  },
  publicUrl: process.env.PUBLIC_UI
};
