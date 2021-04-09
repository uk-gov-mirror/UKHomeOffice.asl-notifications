module.exports = ({ schema, logger }) => params => {
  const { Notification } = schema;

  return Promise.resolve()
    .then(() => Notification.query().findOne({ identifier: params.identifier }).skipUndefined())
    .then(notified => {
      if (notified) {
        return Promise.resolve();
      }
      return Notification.query().insert(params);
    })
    .catch(e => logger.error(e.message));
};
