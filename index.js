const app = require('./lib/app');
const settings = require('./config');

const server = app(settings).listen(settings.port, (err, result) => {
  if (err) {
    return console.error(err);
  }
  console.log(`Listening on port ${server.address().port}`);
});
