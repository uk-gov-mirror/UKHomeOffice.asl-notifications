module.exports = {
  type: {
    pil: {
      application: 'PIL application',
      amendment: 'PIL amendment',
      revocation: 'PIL revocation',
      transfer: 'PIL transfer'
    },
    ppl: {
      application: 'PPL application',
      amendment: 'PPL amendment',
      revocation: 'PPL revocation'
    },
    pel: {
      application: 'PEL application',
      amendment: 'PEL amendment',
      revocation: 'PEL revocation'
    },
    profile: {
      amendment: 'Profile update'
    }
  },
  identifier: {
    pil: {
      application: 'Applicant name',
      amendment: 'Licence holder name',
      revocation: 'Licence holder name',
      transfer: 'Licence holder name'
    },
    ppl: {
      application: 'Project name',
      amendment: 'Project name',
      revocation: 'Project name'
    },
    pel: {
      amendment: 'Establishment name',
      revocation: 'Establishment name'
    },
    profile: 'Name'
  },
  status: {
    new: 'Draft',
    'resubmitted': 'Resubmitted',
    'returned-to-applicant': 'Returned',
    'withdrawn-by-applicant': 'Withdrawn',
    'with-ntco': 'Awaiting endorsement',
    'awaiting-endorsement': 'Awaiting endorsement',
    'with-licensing': 'Awaiting review',
    'with-inspectorate': 'Awaiting review',
    'referred-to-inspector': 'Awaiting recommendation',
    'inspector-recommended': 'Recommendation made',
    'inspector-rejected': 'Recommendation made',
    resolved: 'Approved',
    rejected: 'Rejected'
  },
  subject: {
    'task-action': 'Action required',
    'task-change': 'Status change',
    'task-outgoing': 'Status change'
  }
};
