const value = `The project licence below includes a condition that is required to be met {{when}}.

Licence number: {{licenceNumber}}
Deadline to be met: {{deadline}}

If you are the licence holder you should [check what's required]({{licenceUrl}}) and ensure you have fulfilled the
requirement by the deadline. Failure to do so will constitute a breach of your licence terms.

If you have any queries, please email our licensing team at asrulicensing@homeoffice.gov.uk.`;

module.exports = {
  requires: ['when', 'licenceNumber', 'deadline', 'licenceUrl'],
  value
};
