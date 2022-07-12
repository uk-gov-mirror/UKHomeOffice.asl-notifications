const value = `A return of procedures is due {{when}} for the following project licence: 

Title: {{projectTitle}}
Licence number: {{licenceNumber}}
Deadline for submission: {{ropsDeadline}}

[Submit return of procedures now.]({{reportingUrl}})

If you have any queries, please email our licensing team at asrulicensing@homeoffice.gov.uk.`;

module.exports = {
  requires: ['when', 'projectTitle', 'licenceNumber', 'ropsDeadline', 'reportingUrl'],
  value
};
