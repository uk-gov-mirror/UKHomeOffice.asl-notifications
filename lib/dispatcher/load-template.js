const fs = require('fs');
const path = require('path');

module.exports = template => {
  return new Promise((resolve, reject) => {
    const templatePath = path.resolve(__dirname, `./templates/${template}.html`);
    fs.readFile(templatePath, (err, content) => {
      return err ? reject(err) : resolve(content.toString());
    });
  });
};
