const value = `Representations have been made for the conditions added to project licence {{ licenceNumber }}.

You can view the details of the representations at {{{taskUrl}}}.
You can view the licence at {{{licenceUrl}}}.

`;

module.exports = {
  requires: ['licenceNumber', 'licenceUrl', 'taskUrl'],
  value
};
