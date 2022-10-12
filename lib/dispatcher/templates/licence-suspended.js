const value = `
The {{modelType}} licence below has been suspended.

Licence number: {{licenceNumber}}
Suspension date: {{suspendedDate}}

All work authorised under this licence must stop immediately. You are reminded that it is illegal to perform regulated
procedures without a licence.

[You can view the suspension here (log in required)]({{{taskUrl}}}).

Should you have any queries, please email our licensing team at asrulicensing@homeoffice.gov.uk.`;

module.exports = {
  requires: ['modelType', 'licenceNumber', 'suspendedDate', 'taskUrl'],
  value
};
