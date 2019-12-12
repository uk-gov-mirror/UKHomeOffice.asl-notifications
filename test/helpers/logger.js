// const log = msg => console.log(msg);
const log = msg => {};

module.exports = {
  error: log,
  warn: log,
  info: log,
  verbose: log,
  debug: log,
  silly: log
};
