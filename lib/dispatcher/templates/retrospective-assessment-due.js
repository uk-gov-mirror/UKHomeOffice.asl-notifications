const value = `A retrospective assessment is due {{when}} for the following {{projectStatus}} project licence:

Title: {{projectTitle}}
Licence number: {{licenceNumber}}
Deadline for submission: {{raDate}}

[Submit your retrospective assessment now]({{licenceUrl}}).

If you have any queries, please email our licensing team at asrulicensing@homeoffice.gov.uk.`;

module.exports = {
  requires: ['when', 'projectStatus', 'projectTitle', 'licenceNumber', 'raDate', 'licenceUrl'],
  value
};
