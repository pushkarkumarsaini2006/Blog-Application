import React from "react";
import { getFullImageUrl } from '../../../utils/helper';

const FeaturedBlogPost = ({
  title,
  coverImageUrl,
  description,
  tags=[],
  updatedOn,
  authorName,
  authProfileImg,
  onClick,
  showImage = true,
  showAuthorInfo = true,
}) => {
  const isClickable = typeof onClick === "function";

  return <div
      className={`grid grid-cols-12 bg-white shadow-lg shadow-gray-100 rounded-xl overflow-hidden ${isClickable ? "cursor-pointer" : "cursor-default"}`}
      onClick={isClickable ? onClick : undefined}
    >
      {showImage && (
        <div className="col-span-6">
          <img
            src={getFullImageUrl(coverImageUrl)}
            alt={title}
            className="w-full h-80 object-cover"
          />
        </div>
      )}

      <div className={showImage ? "col-span-6" : "col-span-12"}>
        <div className="p-6">
          <h2 className="text-lg md:text-2xl font-bold mb-2 line-clamp-3">
            {title}
          </h2>
          <p className="text-gray-700 text-[13px] mb-4 line-clamp-3">
            {description}
          </p>

          <div className="flex items-center flex-wrap gap-2 mb-4">
            {tags.slice(0,3).map((tag, index) => (
              <span
                key={index}
                className="bg-sky-200/50 text-sky-800/80 text-xs font-medium px-3 py-0.5 rounded-full text-nowrap"
              >
                # {tag}
              </span>
            ))}
          </div>

          {showAuthorInfo ? (
            <div className="flex items-center">
              <img
                src={getFullImageUrl(authProfileImg)}
                alt={authorName}
                className="w-8 h-8 rounded-full mr-2"
              />

              <div>
                <p className="text-gray-600 text-sm">{authorName}</p>
                <p className="text-gray-500 text-xs">{updatedOn}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-xs">{updatedOn}</p>
          )}
        </div>
      </div>
    </div>
};

export default FeaturedBlogPost;
