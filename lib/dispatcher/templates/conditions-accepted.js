const value = `The new conditions you added project licence {{ licenceNumber }} have been accepted.

The licence has now been updated.

You can view the licence at {{{licenceUrl}}}.

`;

module.exports = {
  requires: ['licenceNumber', 'licenceUrl', 'taskUrl'],
  value
};
