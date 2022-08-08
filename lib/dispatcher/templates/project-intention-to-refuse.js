const value = `The Home Office has given notice of their intention to refuse a licence for the application below:

Application title: {{projectTitle}}

The applicant has the right to make representations against this determination in writing or in person.

You can [find out how and view the Home Office's reasons for refusal in the notice of intention to refuse]({{{taskUrl}}}).`;

module.exports = {
  requires: ['projectTitle', 'taskUrl'],
  value
};
