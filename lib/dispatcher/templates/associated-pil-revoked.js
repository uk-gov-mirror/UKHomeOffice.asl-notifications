const value = `Someone with an account at your establishment has had their personal licence revoked.

The licence is held at another establishment but you can still [view the revoked licence]({{{licenceUrl}}}).

If you no longer wish to receive emails about this account holder you can
[remove them from your establishment]({{{profileUrl}}}).`;

module.exports = {
  value,
  requires: ['licenceUrl', 'profileUrl']
};
