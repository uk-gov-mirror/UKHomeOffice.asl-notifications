const value = `Personal licence (Category E) revoked

A course participant’s Category E licence has been revoked.

Course title: {{trainingCourseTitle}}
Course participant: {{licenceHolderName}}

The participant is no longer authorised to carry out regulated procedures under this licence.

You can [see a record of this revocation online (log in required)]({{{taskUrl}}}).
`;

module.exports = {
  value,
  requires: ['trainingCourseTitle', 'licenceHolderName', 'taskUrl']
};
