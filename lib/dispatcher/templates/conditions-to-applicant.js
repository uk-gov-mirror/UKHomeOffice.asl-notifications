const value = `New conditions have been added to your project licence {{ licenceNumber }}.

You have 28 days to accept the new conditions or make representation if you oppose them.
If you do not act in this time the conditions will be added to the licence.

You can view the new conditions at {{{taskUrl}}}.
You can view the licence at {{{licenceUrl}}}.

`;

module.exports = {
  requires: ['licenceNumber', 'licenceUrl', 'taskUrl'],
  value
};
