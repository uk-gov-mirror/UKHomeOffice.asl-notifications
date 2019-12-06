module.exports = {

  test: {
    client: 'postgres',
    connection: {
      database: process.env.DATABASE_NAME || 'asl-test',
      host: process.env.DATABASE_HOST || 'localhost',
      user: process.env.DATABASE_USERNAME || 'postgres'
    }
  }

};
