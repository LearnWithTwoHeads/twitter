import { Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UserCircleIcon,
  UserIcon,
  Bars3Icon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "../providers/AuthProvider";
import { handleTweetPost } from "../api";
import { useTweetContext } from "../providers/TweetProvider";

const SidebarMenu = ({ closeSidebar }) => {
  const { toggleRerender } = useTweetContext(); 
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="md:ml-0 ml-2">
      <div className="md:mt-12 mt-4 flex justify-between">
        <div className="font-bold text-2xl">Twitter Clone</div>
        {closeSidebar && (
          <ChevronDoubleLeftIcon
            className="h-8 w-8 mr-2"
            onClick={() => closeSidebar()}
          />
        )}
      </div>
      <div className="mt-12">
        <ul>
          <li>
            <div className="flex items-center space-x-2">
              <HomeIcon className="h-4 w-4" />
              <div
                className="hover:text-gray-500 text-2xl cursor-pointer"
                onClick={() => {
                  navigate("/home");
                }}
              >
                Home
              </div>
            </div>
          </li>
          <li>
            <div className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4" />
              <div
                className="hover:text-gray-500 text-2xl cursor-pointer"
                onClick={() => {
                  navigate(`/${user.username}`);
                }}
              >
                Profile
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="mt-8">
        <button
          className="btn w-1/2 bg-sky-300 text-black rounded-3xl hover:bg-sky-500"
          onClick={() => document.getElementById("tweet_modal").showModal()}
        >
          Post
        </button>
        <dialog id="tweet_modal" className="modal">
          <div className="modal-box">
            <Formik
              enableReinitialize
              initialValues={{
                content: "",
              }}
              onSubmit={async (values, { resetForm }) => {
                await handleTweetPost(values.content);
                document.getElementById("tweet_modal").close();
                resetForm({ values: "" });
                toggleRerender();
              }}
            >
              {({ values, handleChange, handleSubmit }) => (
                <form className="flex flex-col" onSubmit={handleSubmit}>
                  <div className="text-2xl font-bold">Tweet</div>
                  <textarea
                    name="content"
                    id="content"
                    className="mt-8 textarea textarea-bordered w-full"
                    placeholder="What's up my G?!"
                    value={values.content}
                    maxLength="200"
                    onChange={handleChange}
                  />
                  <div className="mt-8 ml-auto text-sm font-extralight">
                    {values.content ? values.content.length : 0}
                    /200
                  </div>
                  <button
                    className="mt-4 btn bg-sky-300 text-black rounded-3xl hover:bg-sky-500 ml-auto"
                    type="submit"
                  >
                    Post
                  </button>
                </form>
              )}
            </Formik>
          </div>
        </dialog>
      </div>
      <button
        className="mt-4 btn w-1/2 bg-sky-300 text-black rounded-3xl hover:bg-sky-500 ml-auto"
        onClick={async () => {
          await handleLogout();
        }}
      >
        Logout
      </button>
      <div className="mt-12">
        <UserCircleIcon className="h-8 w-8 rounded-full" aria-hidden="true" />
        <div className="mt-2 text-md font-semibold">@{user.username}</div>
      </div>
    </div>
  );
};

export const Personal = () => {
  // This state is only used for mobile view.
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <div className="md:hidden block mt-4 ml-4">
        <Bars3Icon className="h-8 w-8" onClick={() => setShowSidebar(true)} />
      </div>
      <div
        className={`top-0 left-0 w-4/6 z-40 bg-blue-300 fixed h-4/6 ease-in-out duration-300 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarMenu closeSidebar={() => setShowSidebar(false)} />
      </div>
      <div className="md:w-1/4 md:block hidden">
        <SidebarMenu />
      </div>
    </>
  );
};
