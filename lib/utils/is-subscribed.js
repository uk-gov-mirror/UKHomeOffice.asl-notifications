const { get } = require('lodash');
/**
 * emailPreferences.preferences json example:
 * {
 *   "alerts-8201": ["pel"],
 *   "alerts-8202": ["pel"],
 *   "alerts-30001": ["pil", "ppl", "pel"]
 *   "newsletters": ["operational"],
 *   "projectCollaborations": false
 * }
 */
const subscribed = ({ establishmentId, licenceType, profile }) => {
  const preferences = get(profile, `emailPreferences.preferences['alerts-${establishmentId}']`);

  if (preferences && !preferences.includes(licenceType)) {
    return false; // user has unsubscribed from alerts for this licence type at this establishment
  }

  return true; // subscribed or no preferences set (default to subscribed)
};

const subscribedFilter = ({ establishmentId, licenceType }) => (profile) => {
  return subscribed({ establishmentId, licenceType, profile });
};

const subscribedToCollaborations = profile => {
  const collabPrefs = get(profile, 'emailPreferences.preferences.projectCollaborations');

  if (collabPrefs === undefined) {
    return true; // default to true if no collab preferences saved
  }

  return !!collabPrefs;
};

module.exports = {
  subscribed,
  subscribedFilter,
  subscribedToCollaborations
};
