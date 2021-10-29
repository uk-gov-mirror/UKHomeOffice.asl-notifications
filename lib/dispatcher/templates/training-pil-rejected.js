const value = `Personal licence (Category E) refused

We have refused an application for a Category E licence.

Course title: {{trainingCourseTitle}}
Course participant: {{licenceHolderName}}

The participant will not be able to attend this course.

You can [see our reason for refusing this application online (log in required)]({{{taskUrl}}}).
`;

module.exports = {
  value,
  requires: ['trainingCourseTitle', 'licenceHolderName', 'taskUrl']
};
