const value = `{{ licenceType }} licence {{ licenceNumber }} has been {{ grantType }}.

You can view the licence at {{{licenceUrl}}}.

Note, this licence may be updated with design changes as the Home Office works to make licences clearer.
These changes will have no impact on the authorities within the licence.
`;

module.exports = {
  requires: ['licenceType', 'licenceNumber', 'grantType', 'licenceUrl'],
  value
};
