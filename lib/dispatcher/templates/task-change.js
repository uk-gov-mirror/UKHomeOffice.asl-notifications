const value = `The status of a {{ taskType }} has changed.

{{ identifier }}: {{ identifierValue }}

Previous status: {{ prevStatus }}

New status: {{ newStatus }}

You can see more details about this task by visiting {{{taskUrl}}}
`;

module.exports = {
  requires: ['taskType', 'identifier', 'identifierValue', 'prevStatus', 'newStatus', 'taskUrl'],
  value
};
