module.exports = {
  pil: {
    taskType: 'PIL application',
    identifier: 'Applicant name',
    'new': 'New',
    'autoresolved': 'Draft',
    'returned-to-applicant': 'Returned',
    'withdrawn-by-applicant': 'Withdrawn',
    'with-ntco': 'Awaiting endorsement',
    'ntco-endorsed': 'Awaiting endorsement',
    'with-licensing': 'Awaiting review',
    'referred-to-inspector': 'Awaiting recommendation',
    'inspector-recommended': 'Recommendation made',
    'inspector-rejected': 'Recommendation made',
    'resolved': 'Granted',
    'rejected': 'Rejected'
  },
  project: {
    // when a ppl application is submitted, they are in state with-inspectorate
    taskType: 'PPL application',
    identifier: 'Applicant name',
    'new': 'New',
    'autoresolved': 'Draft',
    'returned-to-applicant': 'Returned',
    'withdrawn-by-applicant': 'Withdrawn',
    'referred-to-inspector': 'Awaiting recommendation',
    'inspector-recommended': 'Recommendation made',
    'inspector-rejected': 'Recommendation made',
    'resolved': 'Granted',
    'rejected': 'Rejected'
  }
};
