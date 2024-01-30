const { v4 } = require("uuid");
const {
  COOKIE_NAME,
  TWEETS_TABLE_NAME,
  USERS_TABLE_NAME,
  TWEET_LIKES_TABLE_NAME,
  USERS_FOLLOWERS_TABLE_NAME,
} = require("../constants");
const { InternalServerError } = require("../errors");
const { getDbConnection, getRedisConnection } = require("../storage");
const { getTweetKey } = require("../util");

const TWEET_LIKES_UPDATE_INTERVAL =
  parseInt(process.env["TWEET_LIKES_UPDATE_INTERVAL"], 10) || 5000;

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getTweets(req, res) {
  const username = req.params["username"];

  const limit = req.query["limit"] || "10";
  const offset = req.query["offset"] || "0";

  const [results] = await (
    await getDbConnection()
  ).query(
    `SELECT t.id, t.username, t.tweet, t.createdAt, t.likes, u.firstName, u.lastName FROM ${TWEETS_TABLE_NAME} AS t
     JOIN ${USERS_TABLE_NAME} AS u ON t.username = u.username
     WHERE t.username=? ORDER BY createdAt DESC LIMIT ${limit} OFFSET ${offset}`,
    [username]
  );

  const tweets = await tweetsHelper(results);

  return res.status(200).json(tweets);
}

async function tweetsHelper(results) {
  const tweets = [];

  for (const res of results) {
    const id = res["id"];
    const likes = await (await getRedisConnection()).get(`tweet_${id}`);

    const tweet = {
      id,
      author: res["username"],
      tweetContent: res["tweet"],
      likes: likes,
      createdAt: res["createdAt"],
      firstName: res["firstName"],
      lastName: res["lastName"],
    };

    tweets.push(tweet);
  }

  return tweets;
}

/**
 *
 * @param {*} req
 * @param {*} res
 */
async function homeTweets(req, res) {
  const selfCookie = req.cookies[COOKIE_NAME];

  const value = await (await getRedisConnection()).get(selfCookie);

  let self;

  try {
    self = JSON.parse(value);
  } catch (error) {
    throw new InternalServerError("internal error");
  }

  const limit = req.query["limit"] || "10";
  const offset = req.query["offset"] || "0";

  // Work around for getting all the followers of the user plus the user themselves
  // within the subsequent query.
  const [followeesResults] = await (
    await getDbConnection()
  ).query(
    `
    SELECT followee FROM ${USERS_FOLLOWERS_TABLE_NAME} WHERE follower=?
  `,
    [self.username]
  );

  const followees = [];
  for (const followee of followeesResults) {
    followees.push([followee["followee"]]);
  }

  followees.push(self.username);

  const [results] = await (
    await getDbConnection()
  ).query(
    `
    SELECT t.id, t.username, t.tweet, t.createdAt, t.likes, u.firstName, u.lastName
    FROM ${TWEETS_TABLE_NAME} AS t JOIN ${USERS_TABLE_NAME} AS u ON t.username = u.username
    WHERE t.username IN (?) ORDER BY createdAt DESC
    LIMIT ${limit} OFFSET ${offset}
  `,
    [followees]
  );

  const tweets = await tweetsHelper(results);

  return res.status(200).json(tweets);
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function postTweet(req, res) {
  const selfCookie = req.cookies[COOKIE_NAME];
  const { tweetContent } = req.body;
  const value = await (await getRedisConnection()).get(selfCookie);

  try {
    const self = JSON.parse(value);
    const tweetId = v4();
    await (
      await getDbConnection()
    ).execute(
      `INSERT INTO ${TWEETS_TABLE_NAME} (id, username, tweet) VALUES (?,?,?)`,
      [tweetId, self.username, tweetContent]
    );
    return res.sendStatus(200);
  } catch (error) {
    throw new InternalServerError("error posting tweet");
  }
}

/**
 * likeTweet will insert a record into the database the maps the tweet id to the user who liked
 * the tweet. Also, it will increment the value in Redis for the tweet id.
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function likeTweet(req, res) {
  const user = req.user;
  const tweetId = req.params["tweetId"];

  try {
    await (
      await getDbConnection()
    ).execute(
      `INSERT INTO ${TWEET_LIKES_TABLE_NAME} (tweetId, liker) VALUES (?,?)`,
      [tweetId, user.username]
    );

    const tweetKey = getTweetKey(tweetId);

    await (await getRedisConnection()).incr(tweetKey);

    return res.sendStatus(200);
  } catch (error) {
    throw new InternalServerError("error liking tweet");
  }
}

// Very basic function that runs asynchronously of the application to group the tweets according to tweet id,
// and dump the number of likes into the appropriate row in the tweets table.
//
// This is to avoid contention on a row if we were to go the route of manipulating the likes column for each tweet
// every time we processed a like.
setInterval(() => {
  (async () => {
    try {
      const [results] = await (
        await getDbConnection()
      ).query(
        `SELECT tweetId as id, COUNT(*) as count FROM ${TWEET_LIKES_TABLE_NAME} GROUP BY tweetId`
      );
      for (const res of results) {
        await (
          await getDbConnection()
        ).execute(`UPDATE ${TWEETS_TABLE_NAME} SET likes=? WHERE id=?`, [
          res["count"],
          res["id"],
        ]);
      }
    } catch (error) {}
  })();
}, TWEET_LIKES_UPDATE_INTERVAL);

module.exports = {
  getTweets,
  homeTweets,
  likeTweet,
  postTweet,
};
