const value = `{{#isLicenceHolder}}
A colleague has been given access to view your project:
{{/isLicenceHolder}}
{{^isLicenceHolder}}
You have been given access to view the following project:
{{/isLicenceHolder}}

{{{licenceUrl}}}
`;

module.exports = {
  requires: ['licenceUrl'],
  value
};
