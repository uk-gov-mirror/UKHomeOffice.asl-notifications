const value = `The personal licence below has completed its 5 year review:

Licence number: {{licenceNumber}}
Review completed: {{today}}

[You can view the record of the review here (log in required)]({{taskUrl}}).
`;

module.exports = {
  requires: ['licenceNumber', 'today', 'taskUrl'],
  value
};
