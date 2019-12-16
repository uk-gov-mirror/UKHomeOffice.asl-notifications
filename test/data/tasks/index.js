module.exports = {
  pilApplicationSubmitted: require('./pil/pil-application-submitted'),
  pilApplicationEndorsed: require('./pil/pil-application-endorsed'),
  pilApplicationApproved: require('./pil/pil-application-approved'),
  pilApplicationGranted: require('./pil/pil-application-granted'),
  pilApplicationRejected: require('./pil/pil-application-rejected'),

  pilTransferSubmitted: require('./pil/pil-transfer-submitted'),
  pilTransferEndorsed: require('./pil/pil-transfer-endorsed'),
  pilTransferApproved: require('./pil/pil-transfer-approved'),
  pilTransferGranted: require('./pil/pil-transfer-granted'),
  pilTransferRejected: require('./pil/pil-transfer-rejected'),

  projectApplicationSubmitted: require('./project/project-application-submitted'),
  projectApplicationEndorsed: require('./project/project-application-endorsed'),
  projectApplicationApproved: require('./project/project-application-approved'),
  projectApplicationGranted: require('./project/project-application-granted'),
  projectApplicationRejected: require('./project/project-application-rejected')
};
