const bcrypt = require("bcrypt");

async function generatePassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return hashedPassword;
}

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

function getTweetKey(tweetId) {
  return `tweet_${tweetId}`;
}

module.exports = {
  comparePassword,
  generatePassword,
  getTweetKey,
};
