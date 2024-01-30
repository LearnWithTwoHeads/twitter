const express = require("express");
const {
  getTweets,
  likeTweet,
  postTweet,
  homeTweets,
} = require("./controllers");

const tweetsRouter = express.Router();

tweetsRouter.get("/users/:username", getTweets);

tweetsRouter.get("/home", homeTweets);

tweetsRouter.post("/", postTweet);

tweetsRouter.put("/:tweetId/like", likeTweet);

module.exports = {
  tweetsRouter,
};
