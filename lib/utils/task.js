const newStatuses = ['new'];

const closedStatuses = ['resolved', 'rejected', 'discarded-by-applicant', 'withdrawn-by-applicant'];

const withApplicantStatuses = ['returned-to-applicant', 'recalled-by-applicant'];

const withNtcoStatuses = ['awaiting-endorsement', 'with-ntco'];

const withAdminStatuses = ['awaiting-endorsement'];

const withAsruStatuses = ['with-licensing', 'with-inspectorate', 'referred-to-inspector', 'inspector-recommended', 'inspector-rejected'];

const ignoredStatuses = ['autoresolved', 'endorsed', 'updated', 'resubmitted'];

module.exports = {
  newStatuses,
  closedStatuses,
  withApplicantStatuses,
  withNtcoStatuses,
  withAdminStatuses,
  withAsruStatuses,
  ignoredStatuses,

  isNew: task => {
    return newStatuses.includes(task.meta.previous);
  },

  isClosed: task => {
    return closedStatuses.includes(task.status);
  },

  isWithApplicant: task => {
    return withApplicantStatuses.includes(task.status);
  },

  isWithNtco: task => {
    return task.data.model === 'pil' && withNtcoStatuses.includes(task.status);
  },

  isWithEstablishmentAdmin: task => {
    return task.data.model === 'project' && withAdminStatuses.includes(task.status);
  },

  isWithAsru: task => {
    return withAsruStatuses.includes(task.status);
  },

  isOverTheFence: task => {
    return !withAsruStatuses.includes(task.meta.previous) && withAsruStatuses.includes(task.status);
  },

  ignore: task => {
    return ignoredStatuses.includes(task.status);
  },

  isTransfer: task => {
    return task.data.action === 'transfer';
  }
};
