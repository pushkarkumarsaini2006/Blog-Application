import React, { useEffect, useState } from "react";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  LuGalleryVerticalEnd,
  LuLoaderCircle,
} from "react-icons/lu";
import FeaturedBlogPost from "./components/FeaturedBlogPost";
import BlogPostSummaryCard from "./components/BlogPostSummaryCard";
import TrendingPostsSection from "./components/TrendingPostsSection";
import { handleError } from "../../utils/errorHandler";
import useApiCall from "../../hooks/useApiCall";

const BlogLandingPage = () => {
  const navigate = useNavigate();

  const [thoughtPostList, setThoughtPostList] = useState([]);
  const [thoughtPage, setThoughtPage] = useState(1);
  const [thoughtTotalPages, setThoughtTotalPages] = useState(null);
  const [isThoughtLoading, setIsThoughtLoading] = useState(false);
  const [showMoreThoughts, setShowMoreThoughts] = useState(false);
  const [blogPostList, setBlogPostList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasMoreThoughtPages = thoughtPage < thoughtTotalPages;

  // Fetch paginated posts with improved error handling
  const fetchPosts = async (pageNumber = 1) => {
    const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL, {
      params: {
        status: "published",
        postType: "blog",
        page: pageNumber,
      },
    });
    return response.data;
  };

  const { execute: getAllPosts } = useApiCall(fetchPosts, {
    customMessage: "Failed to load blog posts. The backend might be starting up...",
    onRetry: () => getAllPosts(page)
  });

  const fetchThoughtPosts = async (pageNumber = 1) => {
    const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL, {
      params: {
        status: "published",
        postType: "thought",
        page: pageNumber,
      },
    });

    return response.data;
  };

  const { execute: getThoughtPosts } = useApiCall(fetchThoughtPosts, {
    customMessage: "Failed to load thoughts.",
    silent: true,
  });

  // Load posts with error handling
  const loadPosts = async (pageNumber = 1) => {
    try {
      setIsLoading(true);
      const { posts, totalPages } = await getAllPosts(pageNumber);

      setBlogPostList((prevPosts) =>
        pageNumber === 1 ? posts : [...prevPosts, ...posts]
      );

      setTotalPages(totalPages);
      setPage(pageNumber);
    } catch (error) {
      // Error is already handled by useApiCall
      console.error("Error loading posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load more posts
  const handleLoadMore = () => {
    if (page < totalPages) {
      loadPosts(page + 1);
    }
  };

  // Initial load
  useEffect(() => {
    loadPosts(1);
    loadThoughtPosts(1);
  }, []);

  const loadThoughtPosts = async (pageNumber = 1) => {
    try {
      setIsThoughtLoading(true);
      const { posts, totalPages } = await getThoughtPosts(pageNumber);

      setThoughtPostList((prevPosts) =>
        pageNumber === 1 ? posts : [...prevPosts, ...posts]
      );
      setThoughtTotalPages(totalPages);
      setThoughtPage(pageNumber);
    } catch (error) {
      console.error("Error loading thoughts:", error);
    } finally {
      setIsThoughtLoading(false);
    }
  };

  const handleLoadMoreThoughts = () => {
    if (!showMoreThoughts) {
      setShowMoreThoughts(true);
      return;
    }

    if (thoughtPage < thoughtTotalPages) {
      loadThoughtPosts(thoughtPage + 1);
    }
  };

  const handleShowLessThoughts = () => {
    setShowMoreThoughts(false);
  };

  const handleClick = (post) => {
    navigate(`/${post.slug}`);
  };
  return <BlogLayout>
    <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-9">
          <div>
            <h4 className="text-lg text-black font-semibold mb-4">Thoughts</h4>
            {thoughtPostList.length > 0 && (
              <FeaturedBlogPost
                title={thoughtPostList[0].title}
                coverImageUrl={thoughtPostList[0].coverImageUrl}
                showImage={false}
                showAuthorInfo={false}
                description={thoughtPostList[0].content}
                tags={thoughtPostList[0].tags}
                updatedOn={
                  thoughtPostList[0].updatedAt
                    ? moment(thoughtPostList[0].updatedAt).format("Do MMM YYYY")
                    : "-"
                }
                authorName={thoughtPostList[0].author?.name || "Anonymous"}
                authProfileImg={thoughtPostList[0].author?.profileImageUrl || ""}
              />
            )}

            {showMoreThoughts && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {thoughtPostList.length > 1 &&
                thoughtPostList.slice(1).map((item) => (
                  <BlogPostSummaryCard
                    key={item._id}
                    title={item.title}
                    coverImageUrl={item.coverImageUrl}
                    showImage={false}
                    showAuthorInfo={false}
                    description={item.content}
                    tags={item.tags}
                    updatedOn={
                      item.updatedAt ? moment(item.updatedAt).format("Do MMM YYYY") : "-"
                    }
                    authorName={item.author?.name || "Anonymous"}
                    authProfileImg={item.author?.profileImageUrl || ""}
                  />
                ))}
              </div>
            )}

            {(thoughtPostList.length > 1 || hasMoreThoughtPages) && (
              <div className="flex items-center justify-center gap-3 mt-5">
                {(!showMoreThoughts || hasMoreThoughtPages) && (
                  <button
                    className="flex items-center gap-3 text-sm text-white font-medium bg-sky-600 px-7 py-2.5 rounded-full text-nowrap hover:scale-105 transition-all cursor-pointer"
                    disabled={isThoughtLoading}
                    onClick={handleLoadMoreThoughts}
                  >
                    {isThoughtLoading ? (
                      <LuLoaderCircle className="animate-spin text-[15px]" />
                    ) : (
                      <LuGalleryVerticalEnd className="text-lg" />
                    )}
                    {isThoughtLoading
                      ? "Loading..."
                      : showMoreThoughts
                        ? "Show More Thoughts"
                        : "Show More"}
                  </button>
                )}

                {showMoreThoughts && (
                  <button
                    className="text-sm font-medium text-slate-700 border border-slate-300 px-6 py-2.5 rounded-full hover:bg-slate-50 transition-all cursor-pointer"
                    onClick={handleShowLessThoughts}
                  >
                    Show Less
                  </button>
                )}
              </div>
            )}
          </div>

          <h4 className="text-lg text-black font-semibold mt-10 mb-4">Blog</h4>
          {blogPostList.length > 0 && (
            <FeaturedBlogPost
              title={blogPostList[0].title}
              coverImageUrl={blogPostList[0].coverImageUrl}
              description={blogPostList[0].content}
              tags={blogPostList[0].tags}
              updatedOn={
                blogPostList[0].updatedAt
                  ? moment(blogPostList[0].updatedAt).format("Do MMM YYYY")
                  : "-"
              }
              authorName={blogPostList[0].author?.name || "Anonymous"}
              authProfileImg={blogPostList[0].author?.profileImageUrl || ""}
              onClick={() => handleClick(blogPostList[0])}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {blogPostList.length > 0 &&
              blogPostList
                .slice(1)
                .map((item) => (
                  <BlogPostSummaryCard
                    key={item._id}
                    title={item.title}
                    coverImageUrl={item.coverImageUrl}
                    description={item.content}
                    tags={item.tags}
                    updatedOn={
                      item.updatedAt
                        ? moment(item.updatedAt).format("Do MMM YYYY")
                        : "-"
                    }
                    authorName={item.author?.name || "Anonymous"}
                    authProfileImg={item.author?.profileImageUrl || ""}
                    onClick={() => handleClick(item)}
                  />
                ))}
          </div>

          {page < totalPages && (
            <div className="flex items-center justify-center mt-5">
              <button
                className="flex items-center gap-3 text-sm text-white font-medium bg-black px-7 py-2.5 mt-6 rounded-full text-nowrap hover:scale-105 transition-all cursor-pointer"
                disabled={isLoading}
                onClick={handleLoadMore}
              >
                {isLoading ? (
                  <LuLoaderCircle className="animate-spin text-[15px]" />
                ) : (
                  <LuGalleryVerticalEnd className="text-lg" />
                )}{" "}
                {isLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>

        <div className="col-span-12 md:col-span-3">
          <TrendingPostsSection />
        </div>
      </div>
  </BlogLayout>;
};

export default BlogLandingPage;
