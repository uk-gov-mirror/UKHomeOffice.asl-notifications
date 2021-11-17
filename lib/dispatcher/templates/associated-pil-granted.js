const value = `Someone with an account at your establishment has been granted a personal licence.

The licence is held at another establishment but you can still [view the granted licence]({{{licenceUrl}}}).

If you no longer wish to receive emails about this account holder you can
[remove them from your establishment]({{{profileUrl}}}).
`;

module.exports = {
  value,
  requires: ['licenceUrl', 'profileUrl']
};
