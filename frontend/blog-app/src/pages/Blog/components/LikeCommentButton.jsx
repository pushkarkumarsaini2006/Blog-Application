import React, { useContext, useEffect, useState } from "react";
import { LuMessageCircleDashed } from "react-icons/lu";
import { PiHandsClapping } from "react-icons/pi";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import clsx from "clsx";
import { UserContext } from "../../../context/userContext";

const LikeCommentButton = ({ postId, likes, comments }) => {
  const { user, setOpenAuthForm } = useContext(UserContext);
  const [postLikes, setPostLikes] = useState(likes || 0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setPostLikes(likes || 0);
  }, [postId, likes]);

  const handleLikeClick = async () => {
    if (!postId) return;

    if (!user) {
      setOpenAuthForm(true);
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.POSTS.LIKE(postId));

      if (response.data) {
        setPostLikes((prevState) => prevState + 1);
        setLiked(true);

        // Reset animation after 500ms
        setTimeout(() => {
          setLiked(false);
        }, 500);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

    const handleCommentClick = () => {
      if (!user) {
        setOpenAuthForm(true);
        return;
      }

      const commentsSection = document.getElementById("comments-section");
      commentsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

  return <div className="flex justify-center items-center h-screen">
      <div className="fixed bottom-8 right-8 px-6 py-3 bg-black text-white rounded-full shadow-lg flex items-center justify-center">
        <button
          className="flex items-end gap-2 cursor-pointer"
          onClick={handleLikeClick}
        >
          <PiHandsClapping
            className={clsx(
              "text-[22px] transition-transform duration-300",
              liked && "scale-125 text-cyan-500"
            )}
          />
          <span className="text-base font-medium leading-4">{postLikes}</span>
        </button>

        <div className="h-6 w-px bg-gray-500 mx-5"></div>

        <button className="flex items-end gap-2 cursor-pointer" onClick={handleCommentClick}>
          <LuMessageCircleDashed className="text-[22px]" />
          <span className="text-base font-medium leading-4">{comments}</span>
        </button>
      </div>
    </div>
};

export default LikeCommentButton;
