const value = `
The personal licence below is due a review:

Licence number: {{licenceNumber}}
Licence to be reviewed by: {{reviewDate}}

Licences that haven’t been updated in 5 years must be reviewed and confirmed as being up to date. This is a condition of
the licence.

If you are the licence holder you can [complete the review online (log in required)]({{licenceUrl}}).

Should you have any queries, please email our licensing team at asrulicensing@homeoffice.gov.uk.`;

module.exports = {
  requires: ['licenceNumber', 'reviewDate', 'licenceUrl'],
  value
};
