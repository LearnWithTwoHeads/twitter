const express = require("express");
const { login, logout, self, signUp } = require("./controllers");

const authenticationRouter = express.Router();

authenticationRouter.get("/self", self);

authenticationRouter.post("/signup", signUp);

authenticationRouter.post("/login", login);

authenticationRouter.post("/logout", logout);

module.exports = {
  authenticationRouter,
};
