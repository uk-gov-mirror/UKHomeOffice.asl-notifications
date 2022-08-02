const value = `You recently issued a notice informing {{applicantName}} of the Home Office's intention to refuse their application for a project licence.

Application title: {{projectTitle}}

The applicant had until yesterday to tell the Home Office if they plan to make representations against this determination.
If the applicant has not done so [you should now formally refuse the licence]({{{taskUrl}}}).`;

module.exports = {
  requires: ['projectTitle', 'taskUrl'],
  value
};
