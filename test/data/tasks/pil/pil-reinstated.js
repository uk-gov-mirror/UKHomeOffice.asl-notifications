const { croydonPilHolder1 } = require('../../../helpers/users');
const pilId = 'a5cd0eb3-1d00-4998-ab14-a67969a4e769';

module.exports = {
  id: '52563acc-2015-47f9-81f8-3741fcbd6664',
  meta: {
    data: {
      id: pilId,
      data: {
        profileId: croydonPilHolder1,
        establishmentId: 8201
      },
      meta: { comment: 'Now complying.' },
      model: 'pil',
      action: 'reinstate',
      changedBy: 'a942ffc7-e7ca-4d76-a001-0b5048a057d1',
      initiatedByAsru: true
    },
    user: {
      id: '0c3679b6-730e-4ce0-a943-3f9694ab7e9b',
      profile: {
        id: 'a942ffc7-e7ca-4d76-a001-0b5048a057d1',
        userId: '0c3679b6-730e-4ce0-a943-3f9694ab7e9b',
        title: 'Dr',
        firstName: 'Inspector',
        lastName: 'Morse',
        dob: '1985-09-24',
        email: 'asru-inspector@homeoffice.gov.uk',
        asruUser: true,
        asruAdmin: false,
        asruLicensing: false,
        asruInspector: true,
        asruSupport: false,
        asruRops: false,
        name: 'Inspector Morse'
      }
    },
    payload: {
      data: {
        establishmentId: 8201,
        profileId: croydonPilHolder1
      },
      meta: { comment: 'Now complying.' },
      model: 'pil',
      id: pilId,
      action: 'reinstate',
      changedBy: 'a942ffc7-e7ca-4d76-a001-0b5048a057d1'
    }
  },
  event: 'update',
  comment: 'Now complying.',
  status: 'new',
  data: {
    id: pilId,
    data: {
      profileId: croydonPilHolder1,
      establishmentId: 8201
    },
    meta: { comment: 'Now complying.' },
    model: 'pil',
    action: 'reinstate',
    changedBy: 'a942ffc7-e7ca-4d76-a001-0b5048a057d1',
    initiatedByAsru: true
  },
  assignedTo: null,
  req: '84638f50-5058-4c65-9761-6f55d7fa9f2b'
};
