const { get } = require('lodash');

const newStatuses = ['new'];

const closedStatuses = ['resolved', 'autoresolved', 'rejected', 'discarded-by-applicant', 'withdrawn-by-applicant'];

const resolvedStatuses = ['resolved', 'autoresolved'];

const withApplicantStatuses = ['returned-to-applicant', 'recalled-by-applicant'];

const withNtcoStatuses = ['awaiting-endorsement', 'with-ntco'];

const withAdminStatuses = ['awaiting-endorsement'];

const withAsruStatuses = ['with-licensing', 'with-inspectorate', 'referred-to-inspector', 'inspector-recommended', 'inspector-rejected'];

const ignoredStatuses = ['endorsed', 'updated', 'resubmitted'];

module.exports = {
  newStatuses,
  closedStatuses,
  resolvedStatuses,
  withApplicantStatuses,
  withNtcoStatuses,
  withAdminStatuses,
  withAsruStatuses,
  ignoredStatuses,

  isNew: task => {
    return newStatuses.includes(task.meta.previous) && task.meta.next !== 'autoresolved';
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

  isIgnoredStatus: task => {
    return ignoredStatuses.includes(task.meta.next);
  },

  isTransfer: task => {
    return task.data.action === 'transfer';
  },

  isGranted: task => {
    if (!resolvedStatuses.includes(task.status)) {
      return false;
    }

    const action = get(task, 'data.action');
    const model = get(task, 'data.model');

    switch (model) {
      case 'place':
        return ['create', 'update'].includes(action);

      case 'role':
        return ['create', 'delete'].includes(action);

      case 'pil':
      case 'project':
        return ['grant', 'transfer'].includes(action);

      case 'establishment':
        return action === 'grant';
    }

    return false;
  },

  isResolved: task => {
    return resolvedStatuses.includes(task.status);
  },

  isAutoresolved: task => {
    return task.status === 'autoresolved';
  }
};
