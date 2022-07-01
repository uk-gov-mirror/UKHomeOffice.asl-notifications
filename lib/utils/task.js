const { get } = require('lodash');

const newStatuses = ['new'];

const closedStatuses = ['resolved', 'rejected', 'discarded-by-applicant', 'withdrawn-by-applicant'];

const resolvedStatuses = ['resolved'];

const withApplicantStatuses = ['returned-to-applicant', 'recalled-by-applicant'];

const withNtcoStatuses = ['awaiting-endorsement', 'with-ntco'];

const withAdminStatuses = ['awaiting-endorsement'];

const withAsruStatuses = ['with-licensing', 'with-inspectorate', 'referred-to-inspector', 'inspector-recommended', 'inspector-rejected'];

const ignoredStatuses = ['endorsed', 'updated', 'resubmitted', 'autoresolved'];

function isDeadlineExtension(task) {
  const action = get(task, 'data.action');
  const model = get(task, 'data.model');

  const deadlineExtension = get(task, 'meta.payload.data.deadline.isExtended');

  return model === 'project' && action === 'grant' && deadlineExtension;
}

const taskHelper = {
  newStatuses,
  closedStatuses,
  resolvedStatuses,
  withApplicantStatuses,
  withNtcoStatuses,
  withAdminStatuses,
  withAsruStatuses,
  ignoredStatuses,
  isDeadlineExtension,

  isNew: task => {
    return newStatuses.includes(task.meta.previous) && !closedStatuses.includes(task.meta.next);
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

  isExpiryNotice: task => {
    return task.data.action.match(/^project-expiring-[\d]/);
  },

  isExpired: task => {
    return task.data.action === 'project-expired';
  },

  isRaDueNotice: task => {
    return task.data.action.match(/^ra-due-/);
  },

  isReminderNotice: task => {
    return task.data.action.match(/^condition-reminder-/);
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

  isUnresolvedTransfer: task => {
    return taskHelper.isTransfer(task) && !taskHelper.isResolved(task);
  },

  isGranted: task => {
    if (!resolvedStatuses.includes(task.status)) {
      return false;
    }

    const action = get(task, 'data.action');
    const model = get(task, 'data.model');

    switch (model) {
      case 'place':
      case 'role':
        return true;

      case 'pil':
        return ['grant', 'transfer'].includes(action);

      case 'project':
        return ['grant', 'transfer', 'update'].includes(action);

      case 'establishment':
        return action === 'grant';
    }

    return false;
  },

  isResolved: task => {
    return resolvedStatuses.includes(task.status);
  },

  isRejected: task => {
    return task.status === 'rejected';
  },

  isAutoresolved: task => {
    return task.status === 'autoresolved';
  },

  allowedUpdate: task => {
    return isDeadlineExtension(task);
  }
};

module.exports = taskHelper;
