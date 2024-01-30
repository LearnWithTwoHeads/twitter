const { v4 } = require("uuid");
const moment = require("moment");
const { getDbConnection, getRedisConnection } = require("../storage");
const { USERS_TABLE_NAME, COOKIE_NAME } = require("../constants");
const { comparePassword, generatePassword } = require("../util");
const { NotFoundError, ForbiddenError } = require("../errors");

/**
 * self will return the user information back to the client from the middleware.
 * @param req
 * @param res
 * @returns
 */
async function self(req, res) {
  const user = req.user;
  return res.status(200).json(user);
}

/**
 * signUp will create the user into the data store and create and return a cookie with a
 * session id for future authenticated request(s) by the client.
 * @param req
 * @param res
 */
async function signUp(req, res) {
  const { username, password, firstName, lastName, birthDate } = req.body;

  const hashedPassword = await generatePassword(password);

  const dateOfBirth = moment(birthDate).format("YYYY-MM-DD HH:mm:ss");

  await (
    await getDbConnection()
  ).execute(
    `INSERT INTO ${USERS_TABLE_NAME} (username, password, firstName, lastName, birthDate) VALUES (?, ?, ?, ?, ?)`,
    [username, hashedPassword, firstName, lastName, dateOfBirth]
  );

  const sessionId = v4();

  const redis = await getRedisConnection();

  const userSelf = {
    username,
    firstName,
    lastName,
  };

  // set session for user
  await redis.set(sessionId, JSON.stringify(userSelf));

  res.cookie(COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
  });

  res.setHeader("Location", "/self");

  return res.sendStatus(302);
}
/**
 * login will create a session for the user upon success.
 * @param req
 * @param res
 */
async function login(req, res) {
  const { username, password } = req.body;

  const [results] = await (
    await getDbConnection()
  ).query(
    `SELECT username, password, firstName, lastName FROM ${USERS_TABLE_NAME} WHERE username=?`,
    [username]
  );

  if (results.length === 0) {
    throw new NotFoundError(`${username}`);
  }

  const loginResponse = {
    username: results[0].username,
    password: results[0].password,
    firstName: results[0].firstName,
    lastName: results[0].lastName,
  };

  const isCorrect = await comparePassword(password, loginResponse.password);

  if (!isCorrect) {
    throw new NotFoundError(`${username}`);
  }

  // If the password matches we can create a session for the user and store in session storage.
  const sessionId = v4();
  const userSelf = {
    username,
    firstName: loginResponse.firstName,
    lastName: loginResponse.lastName,
  };

  await (await getRedisConnection()).set(sessionId, JSON.stringify(userSelf));

  res.cookie(COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
  });

  res.setHeader("Location", "/self");

  return res.sendStatus(302);
}

/**
 * logout will clear the session for the user by removing the appropriate values from the session store.
 * @param req
 * @param res
 */
async function logout(req, res) {
  const selfCookie = req.cookies[COOKIE_NAME];

  await (await getRedisConnection()).del(selfCookie);

  res.cookie(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
  });

  return res.sendStatus(200);
}

module.exports = {
  self,
  signUp,
  login,
  logout,
};
