const winston = require("winston");
const LOG_LEVEL = process.env.LOG_LEVEL || "debug";

const myFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  transports: [new winston.transports.Console({ level: LOG_LEVEL })],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.timestamp(),
    myFormat
  ),
});

module.exports = {
  logger,
};
