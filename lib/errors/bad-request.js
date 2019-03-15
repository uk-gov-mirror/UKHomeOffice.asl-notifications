class NotFoundError extends Error {

  constructor() {
    super('Bad request');
    this.status = 400;
  }

}

module.exports = NotFoundError;
