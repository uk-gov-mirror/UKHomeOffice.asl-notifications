const mustache = require('mustache');

module.exports = (template, vars) => {
  return Promise.resolve(require(`./templates/${template}`))
    .then(result => {
      const missing = result.requires.filter(key => vars[key] === undefined);
      if (missing.length) {
        throw new Error(`Missing template vars: ${missing.join()}`);
      }
      return result.value;
    })
    .then(tpl => {
      return mustache.render(tpl, vars);
    });
};
