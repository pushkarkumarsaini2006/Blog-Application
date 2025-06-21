import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  LuLoaderCircle,
  LuReply,
  LuSend,
  LuWandSparkles,
} from "react-icons/lu";
import Input from "./Input";

const CommentReplyInput = ({
  user,
  authorName,
  content,
  replyText,
  setReplyText,
  handleAddReply,
  handleCancelReply,
  disableAutoGen,
  type = "reply",
}) => {
  const [loading, setLoading] = useState(false);

  // Generate Reply Using AI
  const generateReply = async () => {
    setLoading(true);

    try {
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_COMMENT_REPLY,
        {
          author: { name: authorName },
          content,
        }
      );
      const generatedReply = aiResponse.data;

      if (generatedReply?.length > 0) {
        setReplyText(generatedReply);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-5 ml-10 relative">
      <div className="flex items-start gap-3">
        <img
          src={user.profileImageUrl}
          alt={user.name}
          className="w-10 h-10 rounded-full"
        />

        <div className="flex-1">
          <Input
            value={replyText}
            onChange={({ target }) => setReplyText(target.value)}
            label={type == "new" ? authorName : `Reply to ${authorName}`}
            placeholder={type == "new" ? "Message" : "Add a reply"}
            type="text"
          />

          <div className="flex items-center justify-end gap-4">
            <button
              className="flex items-center gap-1.5 text-[14px] font-medium text-gray-500 bg-gray-100 px-4 py-0.5 rounded-full hover:bg-gray-800 hover:text-white cursor-pointer"
              disabled={loading}
              onClick={handleCancelReply}
            >
              Cancel
            </button>

            <button
              className={`flex items-center gap-1.5 text-[14px] font-medium px-4 py-0.5 rounded-full text-sky-600 bg-sky-50 hover:bg-sky-500 hover:text-white cursor-pointer`}
              disabled={replyText?.length == 0 || loading}
              onClick={handleAddReply}
            >
              {type == "new" ? (
                <LuSend className="text-[13px]" />
              ) : (
                <LuReply className="text-[18px]" />
              )}{" "}
              {type == "new" ? "Add" : "Reply"}
            </button>
          </div>
        </div>

        {!disableAutoGen && (
          <button
            className="flex items-center gap-1.5 text-[13px] font-medium text-sky-500 bg-sky-50 px-4 py-0.5 rounded-full hover:bg-sky-500 hover:text-white cursor-pointer absolute top-0 right-0"
            disabled={loading}
            onClick={generateReply}
          >
            {loading ? (
              <LuLoaderCircle className="animate-spin text-[15px]" />
            ) : (
              <LuWandSparkles className="text-[15px]" />
            )}{" "}
            {loading ? "Generating..." : "Gererate Reply"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentReplyInput;
