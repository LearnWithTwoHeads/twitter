export const handleTweetPost = async (tweetContent) => {
  await fetch("/tweets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tweetContent,
    }),
  });
};
