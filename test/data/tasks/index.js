module.exports = {
  // Establishment tasks
  pelApplicationSubmitted: require('./establishment/pel-application-submitted'),
  pelApplicationApproved: require('./establishment/pel-application-approved'),
  pelApplicationGranted: require('./establishment/pel-application-granted'),
  pelApplicationRejected: require('./establishment/pel-application-rejected'),

  pelAmendmentSubmitted: require('./place/pel-amendment-submitted'),
  pelAmendmentApproved: require('./place/pel-amendment-approved'),
  pelAmendmentGranted: require('./place/pel-amendment-granted'),
  pelAmendmentRejected: require('./place/pel-amendment-rejected'),

  // PIL tasks
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

  // Project tasks
  projectApplicationSubmitted: require('./project/project-application-submitted'),
  projectApplicationEndorsed: require('./project/project-application-endorsed'),
  projectApplicationApproved: require('./project/project-application-approved'),
  projectApplicationGranted: require('./project/project-application-granted'),
  projectApplicationRejected: require('./project/project-application-rejected')
};
