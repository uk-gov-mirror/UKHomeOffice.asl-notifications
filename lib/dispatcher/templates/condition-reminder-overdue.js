const value = `The project licence below includes a condition that was required to be met yesterday.

Licence number: {{licenceNumber}}
Deadline to be met: {{deadline}}`;

module.exports = {
  requires: ['when', 'licenceNumber', 'deadline'],
  value
};
