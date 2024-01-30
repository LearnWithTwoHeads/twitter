class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(`${message} not found`);
    this.statusCode = 404;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
};
