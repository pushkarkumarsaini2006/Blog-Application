import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import { getFullImageUrl } from '../../../utils/helper';
import useApiCall from "../../../hooks/useApiCall";

const TrendingPostsSection = () => {
  const navigate = useNavigate();
  const [postList, setPostList] = useState([]);

  // fetch random news posts with error handling
  const fetchNewsPosts = async () => {
    const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL, {
      params: {
        status: "published",
        postType: "news",
        random: true,
        limit: 5,
      },
    });
    return response.data;
  };

  const { execute: getNewsPosts } = useApiCall(fetchNewsPosts, {
    customMessage: "Failed to load news posts. The backend might be starting up...",
    silent: true // Don't show toast errors for optional sidebar section
  });

  const loadNewsPosts = async () => {
    try {
      const data = await getNewsPosts();
      setPostList(data?.posts?.length > 0 ? data.posts : []);
    } catch (error) {
      console.error("Error loading news posts:", error);
      // Silently fail for optional sidebar section
    }
  };

  // handle post click
  const handleClick = (post) => {
    navigate(`/${post.slug}`);
  };

  useEffect(() => {
    loadNewsPosts();
    return () => {};
  }, []);
  return <div>
      <h4 className="text-base text-black font-medium mb-3">News</h4>

      {postList.length > 0 &&
        postList.map((item) => (
          <PostCard
            key={item._id}
            title={item.title}
            coverImageUrl={item.coverImageUrl}
            tags={item.tags}
            onClick={() => handleClick(item)}
          />
        ))}
    </div>
};

export default TrendingPostsSection;

const PostCard =({title, coverImageUrl, tags, onClick})=>{
    return <div className="cursor-pointer mb-3" onClick={onClick}>
      {tags?.[0] && (
        <h6 className="text-[10px] font-semibold text-sky-500">
          {tags[0].toUpperCase()}
        </h6>
      )}

      <div className="flex items-start gap-4 mt-2">
        <img
          src={getFullImageUrl(coverImageUrl)}
          alt={title}
          className="w-14 h-14 object-cover rounded"
        />

        <h2 className="text-sm md:text-sm font-medium mb-2 line-clamp-3">
          {title}
        </h2>
      </div>
    </div>
}
