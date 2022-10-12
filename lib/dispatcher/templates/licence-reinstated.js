const value = `
The {{modelType}} licence below has been reinstated.

Licence number: {{licenceNumber}}
Suspension date: {{suspendedDate}}
Reinstatement date: {{reinstatedDate}}

All work authorised under this licence may continue.

[You can view the reinstatement here (log in required)]({{{taskUrl}}}).

Should you have any queries, please email our licensing team at asrulicensing@homeoffice.gov.uk.`;

module.exports = {
  requires: ['modelType', 'licenceNumber', 'suspendedDate', 'reinstatedDate', 'taskUrl'],
  value
};
