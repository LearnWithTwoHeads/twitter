require("express-async-errors");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const expressWinston = require("express-winston");
const { authenticationRouter } = require("./authentication");
const { logger } = require("./logger");
const { userAuth } = require("./middleware");
const { tweetsRouter } = require("./tweets");
const { usersRouter } = require("./users");

const app = express();

const port = parseInt(process.env.PORT, 10) || 8080;

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Accept,Authorization,Content-Type,X-CSRF-Token",
    exposedHeaders: "Location,Link",
    maxAge: 360,
  })
);

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    level: "debug",
    msg: (req, res) => {
      return `${req.method} ${req.url} ${res.statusCode} ${res.responseTime}ms`;
    },
    colorize: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(userAuth);

app.use("/", authenticationRouter);
app.use("/users", usersRouter);
app.use("/tweets", tweetsRouter);

app.get("/ping", (req, res) => {
  res.status(200).json({
    response: "pong",
  });
  return;
});

app.use((err, req, res, next) => {
  if (!err.statusCode) {
    return res.status(500).json({
      message: "internal server",
    });
  }

  return res.status(err.statusCode).json({
    message: err.message,
  });
});

app.listen(port, "0.0.0.0", () => {
  logger.info(`Twitter clone server listening on port ${port}`);
});
