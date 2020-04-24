const value = `The status of a {{ taskType }} has changed.

{{ identifier }}: {{ identifierValue }}

Previous status: {{ prevStatus }}

New status: {{ newStatus }} at new establishment
`;

module.exports = {
  requires: ['taskType', 'identifier', 'identifierValue', 'prevStatus', 'newStatus'],
  value
};
