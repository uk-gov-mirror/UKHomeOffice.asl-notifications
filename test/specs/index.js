const assert = require('assert');
const dbHelper = require('../helpers/db');

describe('checks', () => {

  beforeEach(() => {
    return dbHelper.reset()
      .then(() => dbHelper.loadFixtures());
  });

  after(() => {
    return dbHelper.destroy();
  });

  it('has a working test harness', () => {
    assert(true);
  });

});
