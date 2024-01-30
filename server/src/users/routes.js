const express = require("express");
const { follow, following, getInfo, updateUserInfo } = require("./controllers");

const usersRouter = express.Router();

usersRouter.get("/:username/info", getInfo);

usersRouter.put("/:username/info", updateUserInfo);

usersRouter.put("/followers", follow);

usersRouter.get("/:username/following", following);

module.exports = {
  usersRouter,
};
