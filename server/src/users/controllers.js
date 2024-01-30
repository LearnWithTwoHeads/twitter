const {
  USERS_FOLLOWERS_TABLE_NAME,
  USERS_TABLE_NAME,
} = require("../constants");
const { NotFoundError, ForbiddenError } = require("../errors");
const { getDbConnection } = require("../storage");

async function getInfo(req, res) {
  const username = req.params["username"];

  const userInfo = await getUserInfo(username);

  return res.status(200).json(userInfo);
}

async function updateUserInfo(req, res) {
  const username = req.params["username"];
  const { firstName, lastName, bio } = req.body;

  const [result] = await (
    await getDbConnection()
  ).execute(
    `UPDATE ${USERS_TABLE_NAME} SET firstName=?, lastName=?, bio=? WHERE username=?`,
    [firstName, lastName, bio, username]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError(`user ${username}`);
  }

  const userInfo = await getUserInfo(username);

  return res.status(200).json(userInfo);
}

async function follow(req, res) {
  const { follower, followee } = req.body;
  const user = req.user;

  // Users must be authenticated to follow somebody. The follower coming from the
  // frontend must match the authenticated user from the cookie information.
  if (follower !== user.username) {
    throw new ForbiddenError("unauthenticated");
  }

  await (
    await getDbConnection()
  ).execute(
    `INSERT INTO ${USERS_FOLLOWERS_TABLE_NAME} (follower, followee) VALUES (?,?)`,
    [follower, followee]
  );

  return res.sendStatus(200);
}

async function getUserInfo(username) {
  const [results] = await (
    await getDbConnection()
  ).query(
    `SELECT username, firstName, lastName, bio, birthDate, createdAt FROM ${USERS_TABLE_NAME} WHERE username=?`,
    [username]
  );

  if (results.length === 0) {
    throw new NotFoundError(`${username}`);
  }

  const userInfo = {
    username: results[0].username,
    firstName: results[0].firstName,
    lastName: results[0].lastName,
    bio: results[0].bio,
    birthDate: results[0].birthDate,
    createdAt: results[0].createdAt,
  };

  return userInfo;
}

async function following(req, res) {
  const { username } = req.params;

  const [[followees], [followers]] = await Promise.all([
    (await getDbConnection()).query(
      `
    SELECT COUNT(*) AS followeeCount FROM ${USERS_FOLLOWERS_TABLE_NAME} WHERE followee=?
  `,
      [username]
    ),
    (await getDbConnection()).query(
      `
    SELECT COUNT(*) AS followerCount FROM ${USERS_FOLLOWERS_TABLE_NAME} WHERE follower=?
  `,
      [username]
    ),
  ]);

  return res.status(200).json({
    followees: followees[0]["followeeCount"],
    followers: followers[0]["followerCount"],
  });
}

module.exports = {
  getInfo,
  updateUserInfo,
  follow,
  getUserInfo,
  following,
};
