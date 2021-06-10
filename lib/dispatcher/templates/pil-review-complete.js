const value = `5 year PIL review for {{licenceNumber}} complete.

You can see more details about this task by visiting {{{taskUrl}}}
`;

module.exports = {
  requires: ['licenceNumber', 'taskUrl'],
  value
};
