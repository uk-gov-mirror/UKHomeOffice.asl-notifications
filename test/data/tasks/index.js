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

  pelSuspended: require('./establishment/pel-suspended'),
  pelReinstated: require('./establishment/pel-reinstated'),

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

  pilAmendmentAsru: require('./pil/pil-amendment-asru'),

  pilSuspended: require('./pil/pil-suspended'),
  pilReinstated: require('./pil/pil-reinstated'),

  // Traing PIL tasks
  trainingPilSubmitted: require('./training-pil/training-pil-submitted'),
  trainingPilEndorsed: require('./training-pil/training-pil-endorsed'),
  trainingPilReturned: require('./training-pil/training-pil-returned'),
  trainingPilRejected: require('./training-pil/training-pil-rejected'),
  trainingPilGranted: require('./training-pil/training-pil-granted'),

  // Project tasks
  projectApplicationSubmitted: require('./project/project-application-submitted'),
  projectApplicationEndorsed: require('./project/project-application-endorsed'),
  projectApplicationApproved: require('./project/project-application-approved'),
  projectApplicationGranted: require('./project/project-application-granted'),
  projectApplicationRejected: require('./project/project-application-rejected'),
  projectRevocation: require('./project/project-revocation'),
  projectTransferSubmitted: require('./project/project-transfer-submitted'),
  projectTransferGranted: require('./project/project-transfer-granted'),
  projectSuspended: require('./project/project-suspended'),
  projectReinstated: require('./project/project-reinstated'),

  // Profile tasks
  profileAmendmentAutoresolved: require('./profile/profile-amendment-autoresolved'),
  profileAmendmentSubmitted: require('./profile/profile-amendment-submitted'),
  profileAmendmentApproved: require('./profile/profile-amendment-approved'),
  profileAmendmentGranted: require('./profile/profile-amendment-granted'),
  profileAmendmentRejected: require('./profile/profile-amendment-rejected')
};
