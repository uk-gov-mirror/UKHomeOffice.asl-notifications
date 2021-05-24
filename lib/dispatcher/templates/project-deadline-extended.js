const value = `The deadline for a {{taskType}} has been extended by 15 working days.

Project title: {{identifierValue}}
Previous deadline: {{previousDeadline}}
New deadline: {{newDeadline}}

You can see more details about this task by visiting {{{taskUrl}}}`;

module.exports = {
  requires: ['taskType', 'identifierValue', 'previousDeadline', 'newDeadline', 'taskUrl'],
  value
};
