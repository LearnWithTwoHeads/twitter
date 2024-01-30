const mysql = require("mysql2/promise");
const { createClient } = require("redis");

const MYSQL_HOST = process.env.MYSQL_HOST || "localhost";
const MYSQL_USER = process.env.MYSQL_USER || "user";
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "password";
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "test";

const REDIS_CONNECTION_STRING =
  process.env.REDIS_CONNECTION_STRING || "redis://localhost:6379";

let redisClient;
let connection;

async function getDbConnection() {
  if (connection !== undefined) {
    return connection;
  }
  const mysqlConnection = await mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    timezone: "+00:00",
  });

  connection = mysqlConnection;

  return connection;
}

async function getRedisConnection() {
  if (redisClient !== undefined) {
    return redisClient;
  }

  const client = await createClient({
    url: REDIS_CONNECTION_STRING,
  })
    .on("error", (err) => {
      throw new Error(`can not connect to Redis: ${err}`);
    })
    .connect();

  redisClient = client;

  return redisClient;
}

module.exports = {
  getDbConnection,
  getRedisConnection,
};
