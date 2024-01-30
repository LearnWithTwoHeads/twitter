const { COOKIE_NAME } = require("../constants");
const { ForbiddenError } = require("../errors");
const { getRedisConnection } = require("../storage");

const EXCLUDED_PATHS = ["/signup", "/login"];

// This function is a middleware that will get the user details from Redis,
// so we do not have to keep doing the same logic within the handlers themselves.
async function userAuth(req, res, next) {
  if (EXCLUDED_PATHS.includes(req.path)) {
    next();
    return;
  }

  const selfCookie = req.cookies[COOKIE_NAME];
  const value = await (await getRedisConnection()).get(selfCookie);

  if (!value) {
    throw new ForbiddenError("not authenticated");
  }

  try {
    const self = JSON.parse(value);
    req.user = self;
    next();
  } catch (error) {
    throw new ForbiddenError("internal error");
  }
}

module.exports = {
  userAuth,
};
