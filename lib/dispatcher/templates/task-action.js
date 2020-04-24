const value = `There is a {{ taskType }} in your task list that needs your attention.

{{ identifier }}: {{ identifierValue }}

You can see more details about this task by visiting {{{taskUrl}}}
`;

module.exports = {
  requires: ['taskType', 'identifier', 'identifierValue', 'taskUrl'],
  value
};
