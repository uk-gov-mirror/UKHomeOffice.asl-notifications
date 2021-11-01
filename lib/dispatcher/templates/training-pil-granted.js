const value = `Personal licence (Category E) approved

We have granted a category E licence. This licence is valid for 3 months.

Course title: {{trainingCourseTitle}}
Course participant: {{licenceHolderName}}
Category E licence expires: {{pilExpiryDate}}

You can revoke the licence at any time before it expires.

Course participants should familiarise themselves with their licence and the
[personal licence standard conditions](https://www.gov.uk/government/publications/personal-licence-standard-conditions/personal-licence-standard-conditions).
You can download the licence [from the course overview (log in required)]({{{trainingCourseUrl}}}).

Note, this licence may be updated with design changes as the Home Office works to make licences clearer. These changes
will have no impact on the authorities within the licence.
`;

module.exports = {
  value,
  requires: ['trainingCourseTitle', 'licenceHolderName', 'pilExpiryDate', 'trainingCourseUrl']
};
