import { Formik } from "formik";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../providers/AuthProvider";
import { Input } from "../components/forms/Input";
import { rfc3339ToDate } from "../util/helpers";
import { useParams } from "react-router-dom";
import { Personal } from "../components/Personal";
import { Tweet } from "../components/Tweet";
import { useTweetContext, TweetProvider } from "../providers/TweetProvider";

const PersonalTimeline = ({ providedUsername }) => {
  const { shouldRerender } = useTweetContext();
  const [tweets, setTweets] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(1);

  useEffect(() => {
    const loadTweets = async () => {
      const response = await fetch(
        `/tweets/users/${providedUsername}?` +
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

    loadTweets();
  }, [providedUsername, shouldRerender]);

  const fetchMoreData = async () => {
    const response = await fetch(
      `/tweets/users/${providedUsername}?` +
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
  );
};

// Profile component will render a page that will show a users information pluys all of their tweets as an
// infinite scroll.
// The username is accepted as a path parameter.
const Profile = () => {
  const { username: providedUsername } = useParams();
  const { user } = useAuth();

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const loadInformation = async () => {
      const [userInfoResponse, followingResponse] = await Promise.all([
        fetch(`/users/${providedUsername}/info`, {
          method: "GET",
        }),
        fetch(`/users/${providedUsername}/following`, {
          method: "GET",
        }),
      ]);

      if (userInfoResponse.status === 200 && followingResponse.status === 200) {
        const userInfoBody = await userInfoResponse.json();
        const followingBody = await followingResponse.json();

        setUserInfo({
          firstName: userInfoBody.firstName,
          lastName: userInfoBody.lastName,
          bio: userInfoBody.bio,
          birthDate: userInfoBody.birthDate,
          createdAt: userInfoBody.createdAt,
          followers: followingBody.followers,
          followees: followingBody.followees,
        });
      }
    };

    loadInformation();
  }, [providedUsername]);

  // This function will only be executed if "username" from the path parameters matches the logged in user.
  const updateUserInfo = async ({ firstName, lastName, bio }) => {
    const response = await fetch(`/users/${providedUsername}/info`, {
      method: "PUT",
      body: JSON.stringify({
        username: providedUsername,
        firstName,
        lastName,
        bio,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const body = await response.json();

    setUserInfo((prevState) => {
      return {
        ...prevState,
        firstName: body.firstName,
        lastName: body.lastName,
        bio: body.bio,
        birthDate: body.birthDate,
        createdAt: body.createdAt,
      };
    });
  };

  const followUser = async ({ follower, followee }) => {
    await fetch("/users/followers", {
      method: "PUT",
      body: JSON.stringify({
        follower,
        followee,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <div className="md:mt-12 mt-4 md:w-1/2 md:mx-0 mx-4">
      <div>
        <div className="flex justify-between items-center">
          <UserCircleIcon
            className="h-24 w-24 rounded-full"
            aria-hidden="true"
          />
          {user.username === providedUsername ? (
            <>
              <button
                className="btn w-28"
                onClick={() => {
                  document.getElementById("edit_profile_modal").showModal();
                }}
              >
                Edit Profile
              </button>
              <dialog id="edit_profile_modal" className="modal">
                <div className="modal-box">
                  <div className="modal-action">
                    <Formik
                      enableReinitialize
                      initialValues={{
                        firstName: userInfo.firstName,
                        lastName: userInfo.lastName,
                        bio: userInfo.bio || "",
                      }}
                      onSubmit={async (values) => {
                        // fetch the update endpoint for user information.
                        await updateUserInfo(values);
                      }}
                    >
                      {({ dirty, handleSubmit, values }) => (
                        <form
                          className="flex flex-col w-full"
                          method="dialog"
                          onSubmit={handleSubmit}
                        >
                          <div className="flex justify-between">
                            <div className="text-3xl font-semibold">
                              Edit Profile
                            </div>
                            <button
                              type="submit"
                              className="btn btn-circle"
                              disabled={!dirty}
                            >
                              Save
                            </button>
                          </div>
                          <div className="my-2">First Name</div>
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            className="input w-full border-black"
                            value={values.firstName}
                          />
                          <div className="my-2">Last Name</div>
                          <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            className="input w-full border-black"
                            value={values.lastName}
                          />
                          <div className="my-2">Bio</div>
                          <Input
                            id="bio"
                            name="bio"
                            type="text"
                            className="input w-full border-black"
                            value={values.bio}
                          />
                        </form>
                      )}
                    </Formik>
                  </div>
                </div>
              </dialog>
            </>
          ) : (
            <div>
              <button
                className="btn w-22"
                onClick={() => {
                  document.getElementById("follow_user_modal").showModal();
                }}
              >
                Follow
              </button>
              <dialog id="follow_user_modal" className="modal">
                <div className="modal-box">
                  <div className="text-3xl">
                    Are you sure you want to follow{" "}
                    <span className="italic font-bold">{providedUsername}</span>
                    ?
                  </div>
                  <div className="mt-8 flex justify-center space-x-20">
                    <button
                      className="btn bg-sky-300 rounded-xl hover:bg-sky-500"
                      onClick={async () => {
                        await followUser({
                          follower: user.username,
                          followee: providedUsername,
                        });
                      }}
                    >
                      Yes
                    </button>
                    <button className="btn rounded-xl">No</button>
                  </div>
                </div>
              </dialog>
            </div>
          )}
        </div>
        <div className="flex">
          <div className="flex flex-col">
            <div>@{providedUsername}</div>
            <div>
              {userInfo.firstName} {userInfo.lastName}
            </div>
          </div>
        </div>
        <div className="mt-4 flex">
          {userInfo.bio ? (
            userInfo.bio
          ) : (
            <span className="italic">Create a bio to be more interesting!</span>
          )}
        </div>
        <div className="mt-4">
          <ul className="flex space-x-2">
            <li>Location</li>
            <li className="text-md">
              Birth Date:{" "}
              <span className="font-bold">
                {rfc3339ToDate(userInfo.birthDate)}
              </span>
            </li>
            <li className="text-md">
              Join Date:{" "}
              <span className="font-bold">
                {rfc3339ToDate(userInfo.createdAt)}
              </span>
            </li>
          </ul>
        </div>
        <div className="mt-4 flex space-x-4">
          <div>
            {userInfo.followees}{" "}
            <span className="font-extralight">Following</span>
          </div>
          <div>
            {userInfo.followers}{" "}
            <span className="font-extralight">Followers</span>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <PersonalTimeline providedUsername={providedUsername} />
      </div>
    </div>
  );
};

export const ProfilePage = () => {
  return (
    <div className="md:flex md:ml-12">
      <TweetProvider>
        <Personal />
        <Profile />
      </TweetProvider>
    </div>
  );
};
