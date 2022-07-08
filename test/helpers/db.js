const Schema = require('@asl/schema');
const fixtures = require('../data');

const snakeCase = str => str.replace(/[A-Z]/g, s => `_${s.toLowerCase()}`);

const dbConfig = {
  client: 'postgres',
  connection: {
    database: process.env.DATABASE_NAME || 'asl-test',
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'test-password'
  }
};

module.exports = {
  init: () => Schema(dbConfig.connection),

  reset: schema => {
    return Object.keys(schema).reduce((p, table) => {
      return p.then(() => {
        if (schema[table].tableName) {
          return schema[table].knex().raw(`truncate ${snakeCase(schema[table].tableName)} cascade;`);
        }
      });
    }, Promise.resolve());
  },

  loadFixtures: schema => {
    return fixtures.default(schema);
  }
};
