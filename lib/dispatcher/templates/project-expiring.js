const value = `
The project licence below is due to expire in {{months}} months.

Licence number: {{licenceNumber}}
Expiry date: {{expiryDate}}

From {{expiryDate}} all work authorised under this licence must stop. You are reminded that it is illegal to perform regulated procedures without a licence.

If you are the licence holder, on expiry of this licence you must:

1. Attend to animals that are suffering - or are likely to suffer - as a result of regulated procedures by either quickly and humanely killing them in line with [section 15 of the Animals (Scientific Procedures) Act 1986](https://www.legislation.gov.uk/ukpga/1986/14/section/15), or transfer them to another project licence. For new licences to be granted in time to allow for a transfer of animals, you must submit your application no later than {{continuationDate}}.
2. [Submit a return of procedures]({{{licenceUrl}}}#reporting) by {{ropsDate}}.{{#raDate}}
3. [Submit a retrospective assessment]({{{licenceUrl}}}) by {{raDate}}.{{/raDate}}
4. Submit a list of any publications your work has been published in by {{publicationsDate}}. This should be emailed to asrulicensing@homeoffice.gov.uk.

These requirements are conditions of your licence. Failure to fulfil any of them constitutes a breach of your licence terms.

If you wish to continue your programme of work, you need to apply online for a new licence by [logging into your account]({{{loginUrl}}}).
If helpful you can also [download your original application]({{{licenceUrl}}}#downloads), including in a .ppl format which
can be uploaded to use as a template for your new application.

If you have any queries, or there are reasons why you cannot meet any of the above deadlines, please email our licensing team at asrulicensing@homeoffice.gov.uk.`;

module.exports = {
  requires: ['months', 'licenceNumber', 'expiryDate', 'ropsDate', 'publicationsDate', 'continuationDate', 'licenceUrl', 'loginUrl'],
  value
};
