const express = require('express');
const bodyParser = require('body-parser');
const c = require('./content');
const fetch = require('r2');

module.exports = settings => {
  const app = express();
  app.use(bodyParser.json());

  // I have the right now logged in user in meta
  // this is the user making changes

  const service = {
    whitelist(json) {
      let tos = [];

      switch (json.meta.next) {
        case 'autoresolved': {
          tos.push({
            name: `${json.meta.user.profile.firstName} ${
              json.meta.user.profile.lastName
            }`,
            to: 'swagbag@swagbag.club', //json.meta.user.profile.email
            template: 'notification_task_change'
          });
          break;
        }
        case 'with-ntco': {
          // I need to send it to two people - applicant and ntco
          console.log('SEND TO TWO PEOPLE');
          // I still have the basci user logged in - I need to notify him as well
          tos.push({
            name: `${json.meta.user.profile.firstName} ${
              json.meta.user.profile.lastName
            }`,
            to: 'swagbag@swagbag.club', //json.meta.user.profile.email
            template: 'notification_task_change'
          });
          // how do I find the NTCO ?
          break;
        } //the applicant and the ntco
        case 'with-licensing': { //the applicant and the licensing officer
          // can find the applicant by subject 304235c0-1a83-49f0-87ca-b11b1ad1e147
          // but how do I find the licensing officer ?
          break;
        }
        case 'referred-to-inspector': {
          //the applicant and the inspector
          // I can find the applicant by subject in json
          // but how do I find the inspector ?
          tos.push({
            name: `${json.meta.user.profile.firstName} ${
              json.meta.user.profile.lastName
            }`,
            to: 'swagbag@swagbag.club', //json.meta.user.profile.email
            template: 'notification_task_action'
          });
          break;
        }
        default: {
          break;
        }
      }

      return Promise.resolve(tos);
    },
    notify(settings, json, to) {
      // const content = c[json.data.model][json.data.action];
      const content = c[json.data.model];
      return Promise.resolve().then(
        fetch(`${settings.emailer.host}/${to.template}`, {
          method: 'POST',
          json: {
            taskType: content.taskType,
            name: to.name,
            to: to.email,
            identifier: content.identifier,
            identifierValue: `${json.meta.user.profile.firstName} ${
              json.meta.user.profile.lastName
            }`,
            prevStatus: content[json.meta.previous],
            newStatus: content[json.meta.next],
            url: '<url>',
            subject: `Status change ${content.taskType}`
          }
        })
      );
    }
  };

  app.post('/notify', (req, res, next) => {
    const json = req.body;

    console.log('----------------------------------------------------------');
    console.log(JSON.stringify(json, undefined, 2));
    console.log('----------------------------------------------------------');

    if (json.data.action === 'create' || json.data.action === 'grant') {
      service.whitelist(json).then(list => {
        list.map(to => {
          service.notify(settings, json, to);
        });
      });
    }
  });

  return app;
};
