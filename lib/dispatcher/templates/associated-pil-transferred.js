const value = `Someone with an account at your establishment has changed the primary establishment where their licence
is held.

You can [view their updated licence]({{{licenceUrl}}}).

If you no longer wish to receive emails about this account holder you can
[remove them from your establishment]({{{profileUrl}}}).`;

module.exports = {
  value,
  requires: ['licenceUrl', 'profileUrl']
};
