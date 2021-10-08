module.exports = {
  type: {
    pil: {
      application: 'PIL application',
      amendment: 'PIL amendment',
      revocation: 'PIL revocation',
      transfer: 'PIL transfer',
      review: '5 year PIL review'
    },
    ppl: {
      application: 'PPL application',
      amendment: 'PPL amendment',
      revocation: 'PPL revocation',
      transfer: 'PPL transfer'
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
  licenceType: {
    pil: 'Personal',
    pel: 'Establishment',
    ppl: 'Project'
  },
  grantType: {
    application: 'granted',
    amendment: 'amended',
    transfer: 'amended'
  },
  identifier: {
    pil: {
      application: 'Applicant name',
      amendment: 'Licence holder name',
      revocation: 'Licence holder name',
      transfer: 'Licence holder name',
      review: 'Licence holder name'
    },
    ppl: {
      application: 'Project name',
      amendment: 'Project name',
      revocation: 'Project name',
      transfer: 'Project name'
    },
    pel: {
      application: 'Establishment name',
      amendment: 'Establishment name',
      revocation: 'Establishment name'
    },
    profile: {
      amendment: 'Name'
    }
  },
  status: {
    new: 'Draft',
    'resubmitted': 'Resubmitted',
    'endorsed': 'Awaiting endorsement',
    'returned-to-applicant': 'Returned',
    'recalled-by-applicant': 'Recalled',
    'withdrawn-by-applicant': 'Withdrawn',
    'discarded-by-applicant': 'Withdrawn',
    'with-ntco': 'Awaiting endorsement',
    'awaiting-endorsement': 'Awaiting endorsement',
    'with-licensing': 'Awaiting decision',
    'with-inspectorate': 'Awaiting recommendation',
    'referred-to-inspector': 'Awaiting recommendation',
    'inspector-recommended': 'Recommendation made',
    'inspector-rejected': 'Recommendation made',
    resolved: 'Approved',
    autoresolved: 'Approved',
    rejected: 'Rejected'
  },
  subject: {
    'task-action': 'Action required {{licenceNumber}}',
    'task-change': 'Status change {{licenceNumber}}',
    'task-outgoing': 'Status change {{licenceNumber}}',
    'licence-granted': 'Licence granted {{licenceNumber}}',
    'licence-amended': 'Licence amended {{licenceNumber}}',
    'associated-pil-amended': 'Licence amended {{licenceNumber}}',
    'associated-pil-granted': 'Licence granted {{licenceNumber}}',
    'associated-pil-revoked': 'Licence revoked {{licenceNumber}}',
    'associated-pil-transferred': 'Licence transferred {{licenceNumber}}',
    'project-expiring': 'Reminder: Project licence {{licenceNumber}} expires in {{months}} months',
    'project-expired': 'Important: project licence {{licenceNumber}} has expired - action required',
    'project-deadline-extended': 'Deadline extended {{licenceNumber}}',
    'retrospective-assessment-due': 'Reminder: Retrospective assessment due {{when}} for {{projectStatus}} project licence {{licenceNumber}}'
  }
};
