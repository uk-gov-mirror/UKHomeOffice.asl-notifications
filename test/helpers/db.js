const knex = require('knex');
const Schema = require('@asl/schema');
const dbConfig = require('../../knexfile');
const fixtures = require('../data');

const db = knex(dbConfig.test);
const schema = Schema(dbConfig.test.connection);

module.exports = {
  reset: () => {
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
  loadFixtures: () => {
    return Promise.resolve()
      .then(() => fixtures.default(schema));
  },
  destroy: () => {
    return schema.destroy();
  }
};
