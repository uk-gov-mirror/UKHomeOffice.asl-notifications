const knex = require('knex');
const Schema = require('@asl/schema');
const fixtures = require('../data');

const dbConfig = {
  client: 'postgres',
  connection: {
    database: process.env.DATABASE_NAME || 'asl-test',
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USERNAME || 'postgres'
  }
};

module.exports = {
  init: () => Schema(dbConfig.connection),

  reset: () => {
    const db = knex(dbConfig);

    return Promise.resolve()
      .then(() => {
        // get the names of all tables in the db
        return db.select('table_name')
          .from('information_schema.tables')
          .whereRaw('table_schema = current_schema()')
          .where('table_catalog', db.client.database());
      })
      .then(results => {
        // remove the knex migration tables from the list
        return results.map(r => r.table_name).filter(tableName => !tableName.includes('knex_'));
      })
      .then(aslTables => {
        // truncate the remaining tables
        return aslTables.reduce((p, table) => {
          return p.then(() => db.raw(`TRUNCATE TABLE ${table} CASCADE`));
        }, Promise.resolve());
      });
  },

  loadFixtures: schema => {
    return fixtures.default(schema);
  }
};
