const value = `
The project licence below has now expired.

Licence number: {{licenceNumber}}
Expiry date: {{expiryDate}}

All work authorised under this licence must stop immediately. You are reminded that it is illegal to perform regulated procedures without a licence.

If you are the licence holder you must now:

1. Attend to animals that are suffering - or are likely to suffer - as a result of regulated procedures by either quickly and humanely killing them in line with [section 15 of the Animals (Scientific Procedures) Act 1986](https://www.legislation.gov.uk/ukpga/1986/14/section/15), or transferring them to a new project licence.
2. [Submit a return of procedures]({{licenceUrl}}#reporting) by {{ropsDate}}.{{#raDate}}
3. [Submit a retrospective assessment]({{licenceUrl}}) by {{raDate}}.{{/raDate}}
4. Submit a list of any publications your work has been published in by {{publicationsDate}}. This should be emailed to asrulicensing@homeoffice.gov.uk.

These requirements are conditions of your licence. Failure to fulfil any of them constitutes a breach of your licence terms.

If you wish to continue your programme of work, or start a new one, you can apply online for a new licence by [logging into your account]({{loginUrl}}). If helpful you can also [download your original application]({{licenceUrl}}#downloads).

Should you have any queries, please email our licensing team at asrulicensing@homeoffice.gov.uk.`;

module.exports = {
  requires: ['licenceNumber', 'expiryDate', 'ropsDate', 'publicationsDate', 'licenceUrl', 'loginUrl'],
  value
};
