CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    bio TEXT,
    birthDate DATETIME NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (username)
);

CREATE TABLE IF NOT EXISTS tweets (
    id VARCHAR(36) NOT NULL,
    username VARCHAR(255) NOT NULL,
    tweet TEXT NOT NULL,
    likes INT NOT NULL DEFAULT 0,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE IF NOT EXISTS usersFollowers (
    follower VARCHAR(255) NOT NULL,
    followee VARCHAR(255) NOT NULL,
    FOREIGN KEY (follower) REFERENCES users(username),
    FOREIGN KEY (followee) REFERENCES users(username),
    CONSTRAINT follwer_followee UNIQUE(follower,followee)
);

CREATE TABLE IF NOT EXISTS tweetLikes (
    tweetId VARCHAR(36) NOT NULL,
    liker VARCHAR(255) NOT NULL,
    FOREIGN KEY (tweetId) REFERENCES tweets(id),
    FOREIGN KEY (liker) REFERENCES users(username),
    CONSTRAINT tweet_liker UNIQUE(tweetId,liker)
);
