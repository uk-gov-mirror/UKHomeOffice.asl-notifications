module.exports = {
  type: {
    pil: {
      application: 'PIL application',
      amendment: 'PIL amendment'
    },
    ppl: {
      application: 'PPL application',
      amendment: 'PPL amendment'
    },
    pel: {
      amendment: 'PEL amendment'
    },
    profile: {
      amendment: 'Profile update'
    }
  },
  identifier: {
    pil: {
      application: 'Applicant name',
      amendment: 'Licence holder name'
    },
    ppl: {
      application: 'Project name',
      amendment: 'Project name'
    },
    pel: {
      amendment: 'Establishment name'
    },
    profile: 'Name'
  },
  status: {
    new: 'Draft',
    'returned-to-applicant': 'Returned',
    'withdrawn-by-applicant': 'Withdrawn',
    'with-ntco': 'Awaiting endorsement',
    'ntco-endorsed': 'Awaiting endorsement',
    'with-licensing': 'Awaiting review',
    'with-inspectorate': 'Awaiting review',
    'referred-to-inspector': 'Awaiting recommendation',
    'inspector-recommended': 'Recommendation made',
    'inspector-rejected': 'Recommendation made',
    resolved: 'Approved',
    rejected: 'Rejected'
  }
};
