const value = `
The personal licence below is now overdue a review:

Licence number: {{licenceNumber}}
Licence to be reviewed by: {{reviewDate}}

Licences that haven’t been updated in 5 years must be reviewed and confirmed as being up to date. This is a condition of
the licence.

If you are the licence holder you should do the review as soon as possible by [logging into your account]({{licenceUrl}}).
Failure to do so will result in compliance action and may result in your licence being revoked.

If you’re having problems carrying out the review, please email our licensing team at aspa.london@homeoffice.gov.uk.`;

module.exports = {
  requires: ['licenceNumber', 'reviewDate', 'licenceUrl'],
  value
};
