import { Formik } from "formik";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import { Personal } from "../components/Personal";
import { Tweet } from "../components/Tweet";
import { handleTweetPost } from "../api";
import { TweetProvider, useTweetContext } from "../providers/TweetProvider";

const HomeTimeline = () => {
  const { toggleRerender, shouldRerender } = useTweetContext();
  const location = useLocation();
  const [tweets, setTweets] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(1);

  useEffect(() => {
    const loadHomeTweets = async () => {
      const response = await fetch(
        `/tweets/home?` +
          new URLSearchParams({
            offset: "0",
            limit: "10",
          })
      );

      if (response.status === 200) {
        const body = await response.json();

        setTweets(body);
      }
    };

    loadHomeTweets();
  }, [location.key, shouldRerender]);

  const fetchMoreData = async () => {
    const response = await fetch(
      `/tweets/home?` +
        new URLSearchParams({
          offset: `${index}0`,
          limit: "10",
        })
    );

    if (response.status === 200) {
      const body = await response.json();

      setTweets((prevTweets) => [...prevTweets, ...body]);
      body.length > 0 ? setHasMore(true) : setHasMore(false);
    }

    setIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div className="md:mt-12 mt-4 md:w-1/2 md:mx-0 mx-4">
      <Formik
        enableReinitialize
        initialValues={{
          content: "",
        }}
        onSubmit={async (values, { resetForm }) => {
          await handleTweetPost(values.content);
          resetForm({ values: "" });
          toggleRerender();
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <form
            className="flex flex-col items-center space-y-2"
            onSubmit={handleSubmit}
          >
            <textarea
              id="content"
              name="content"
              className="mt-8 textarea textarea-bordered md:w-1/2 w-full"
              placeholder="What's up my G?!"
              value={values.content}
              maxLength="200"
              onChange={handleChange}
            />
            <button className="btn bg-sky-300 text-black" type="submit">
              Post
            </button>
          </form>
        )}
      </Formik>
      <div className="mt-4">
        <InfiniteScroll
          dataLength={tweets.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          <div className="flex flex-col space-y-2">
            {tweets.map((tweet, idx) => (
              <Tweet
                key={idx}
                id={tweet.id}
                firstName={tweet.firstName}
                lastName={tweet.lastName}
                tweetContent={tweet.tweetContent}
                likes={tweet.likes}
                providedUsername={tweet.author}
                createdAt={tweet.createdAt}
              />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export const HomePage = () => {
  return (
    <div className="md:flex md:ml-12">
      <TweetProvider>
        <Personal />
        <HomeTimeline />
      </TweetProvider>
    </div>
  );
};
