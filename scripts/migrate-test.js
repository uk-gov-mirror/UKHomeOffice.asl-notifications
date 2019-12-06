/* eslint-disable implicit-dependencies/no-implicit */
const knex = require('knex');
const dbConfig = require('../knexfile');

const migrate = () => {
  return Promise.resolve()
    .then(() => {
      console.log('migrate asl test db');
      process.chdir('./node_modules/@asl/schema');
      return knex(dbConfig.test).migrate.latest();
    });
};

migrate()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
