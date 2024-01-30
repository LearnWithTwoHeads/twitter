import { useState } from "react";
import moment from "moment";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";

const tweetDateUtility = (tweetDate, nowDate) => {
  const hours = nowDate.diff(tweetDate, "hours");

  if (hours < 1) {
    return "0h";
  }
  if (hours >= 1 && hours < 24) {
    return `${hours}h`;
  }
  if (hours >= 24 && hours < 168) {
    return `${Math.floor(hours / 24)}d`;
  }

  return tweetDate.format("MM/DD/YY");
};

export const Tweet = ({
  id,
  firstName,
  lastName,
  tweetContent: tweet,
  likes,
  providedUsername,
  createdAt,
}) => {
  const [likesState, setLikesState] = useState(likes);
  const now = moment();

  const likeTweet = async () => {
    await fetch(`/tweets/${id}/like`, {
      method: "PUT",
    });

    setLikesState((prevLikesState) => prevLikesState + 1);
  };

  return (
    <div className="flex space-x-2 border-2 p-4">
      <UserCircleIcon className="h-6 w-6" />
      <div className="flex flex-col">
        <div className="flex space-x-4">
          <div>
            {firstName} {lastName}
          </div>
          <div>@{providedUsername}</div>
          <div>{tweetDateUtility(moment(createdAt), now)}</div>
        </div>
        <div className="mt-2">{tweet}</div>
        <div className="mt-4 flex items-center space-x-2">
          <HeartIcon
            className="h-4 w-4"
            onClick={async () => {
              await likeTweet();
            }}
          />
          <div>{likesState}</div>
        </div>
      </div>
    </div>
  );
};
