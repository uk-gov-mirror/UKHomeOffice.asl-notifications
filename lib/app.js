const express = require('express');
const bodyParser = require('body-parser');
const content = require('./content');
const fetch = require('r2');

module.exports = settings => {
  const app = express();
  app.use(bodyParser.json());

  app.post('/notify', (req, res, next) => {
    const json = req.body;

    const c = content[json.data.model][json.data.action];

    let identifierValue = '';

    switch (json.data.model) {
      case 'pil': {
        identifierValue = `${json.meta.user.profile.firstName} ${
          json.meta.user.profile.lastName
        }`;
        break;
      }
      default:
        break;
    }
    const data = {
      taskType: c.taskType,
      firstName: json.meta.user.profile.firstName,
      lastName: json.meta.user.profile.lastName,
      identifier: c.identifier,
      identifierValue: identifierValue,
      prevStatus: c[json.meta.previous],
      newStatus: c[json.meta.new],
      url: '',
      subject: `Status change ${c.taskType}`,
      to: json.meta.user.profile.email
    };

    return fetch(`${settings.emailer.host}/notification_other`, {
      method: 'POST',
      json: data
    }).response;
  });

  return app;
};
