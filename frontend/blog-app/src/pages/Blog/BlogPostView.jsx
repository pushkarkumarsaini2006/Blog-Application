import React, { useContext, useEffect, useState } from 'react'
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import {
  LuCircleAlert,
  LuDot,
  LuSparkles,
} from "react-icons/lu";
import { UserContext } from "../../context/userContext";
import CommentReplyInput from "../../components/Inputs/CommentReplyInput";
import toast from "react-hot-toast";
import TrendingPostsSection from "./components/TrendingPostsSection";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import { useNavigate, useParams } from 'react-router-dom';
import BlogLayout from '../../components/layouts/BlogLayout/BlogLayout';
import MarkdownContent from './components/MarkdownContent';
import SharePost from './components/SharePost';
import { sanitizeMarkdown, getFullImageUrl } from '../../utils/helper';
import CommentInfoCard from './components/CommentInfoCard';
import Drawer from '../../components/Drawer';
import LikeCommentButton from './components/LikeCommentButton';

const BlogPostView = () => {

  const { slug } = useParams();
  const navigate = useNavigate();

  const [blogPostData, setBlogPostData] = useState(null);
  const [comments, setComments] = useState(null);

  const { user, setOpenAuthForm } = useContext(UserContext);

  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const [openSummarizeDrawer, setOpenSummarizeDrawer] = useState(false);
  const [summaryContent, setSummaryContent] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [_openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  // Get Post Data By slug
  const fetchPostDetailsBySlug = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POSTS.GET_BY_SLUG(slug)
      );

      if (response.data) {
        const data = response.data;
        setBlogPostData(data);
        fetchCommentByPostId(data._id);
        incrementViews(data._id);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Get Comment by Post ID
  const fetchCommentByPostId = async (postId) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.COMMENTS.GET_ALL_BY_POST(postId)
      );

      if (response.data) {
        const data = response.data;
        setComments(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Generate Blog Post Summary
  const generateBlogPostSummary = async () => {
   try {
      setErrorMsg("");
      setSummaryContent(null);

      setIsLoading(true);
      setOpenSummarizeDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_POST_SUMMARY,
        {
          content: blogPostData.content || "",
        }
      );

      if (response.data) {
        setSummaryContent(response.data);
      }
    } catch (error) {
      setSummaryContent(null);
      setErrorMsg("Failed to generate summary, Try again later");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Increment views
  const incrementViews = async (postId) => {
    if (!postId) return;

    try {
      await axiosInstance.post(
        API_PATHS.POSTS.INCREMENT_VIEW(postId)
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //  Handles canceling a reply
  const handleCancelReply = () => {
    setReplyText("");
    setShowReplyForm(false);
  };

  // Add Reply
  const handleAddReply = async () => {
    try {
      await axiosInstance.post(
        API_PATHS.COMMENTS.ADD(blogPostData._id),
        {
          content: replyText,
          parentComment: "",
        }
      );

      toast.success("Reply added successfully!");

      setReplyText("");
      setShowReplyForm(false);
      fetchCommentByPostId(blogPostData._id);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  useEffect(() => {
    fetchPostDetailsBySlug();
    return () => {};
  }, [slug]);

  return (
    <BlogLayout>
      {blogPostData && (
        <>
          <title>{blogPostData.title}</title>

          <meta name="description" content={blogPostData.title} />
          <meta property="og:title" content={blogPostData.title} />
          <meta property="og:image" content={blogPostData.coverImageUrl} />
          <meta property="og:type" content="article" />

          <div className="grid grid-cols-12 gap-8 relative">
            <div className="col-span-12 md:col-span-8 relative">
              <h1 className="text-lg md:text-2xl font-bold mb-2 line-clamp-3">
                {blogPostData.title}
              </h1>

              <div className="flex items-center gap-1 flex-wrap mt-3 mb-5">
                <span className="text-[13px] text-gray-500 font-medium">
                  {moment(blogPostData.updatedAt || "").format("Do MMM YYYY")}
                </span>

                <LuDot className="text-xl text-gray-400" />

                <div className="flex items-center flex-wrap gap-2">
                  {blogPostData.tags.slice(0, 3).map((tag, index) => (
                    <button
                      key={index}
                      className="bg-sky-200/50 text-sky-800/80 text-xs font-medium px-3 py-0.5 rounded-full text-nowrap cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tag/${tag}`);
                      }}
                    >
                      # {tag}
                    </button>
                  ))}
                </div>

                <LuDot className="text-xl text-gray-400" />

                <button
                  className="flex items-center gap-2 bg-linear-to-r from-sky-500 to-cyan-400 text-xs text-white font-medium px-3 py-0.5 rounded-full text-nowrap cursor-pointer hover:scale-[1.02] transition-all my-1"
                  onClick={generateBlogPostSummary}
                >
                  <LuSparkles /> Summarize Post
                </button>
              </div>

              <img
                src={getFullImageUrl(blogPostData.coverImageUrl || "")}
                alt={blogPostData.title}
                className="w-full h-96 object-cover mb-6 rounded-lg"
              />

              <div>
                <MarkdownContent
                  content={sanitizeMarkdown(blogPostData?.content || "")}
                />

                <SharePost title={blogPostData.title} />

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">Comments</h4>

                    <button
                      className="flex items-center justify-center gap-3 bg-linear-to-r from-sky-500 to-cyan-400 text-xs font-semibold text-white px-5 py-2 rounded-full hover:bg-black hover:text-white cursor-pointer"
                      onClick={() => {
                        if (!user) {
                          setOpenAuthForm(true);
                          return;
                        }
                        setShowReplyForm(true);
                      }}
                    >
                      Add Comment
                    </button>
                  </div>

                  {showReplyForm && (
                    <div className="bg-white pt-1 pb-5 pr-8 rounded-lg mb-8">
                      <CommentReplyInput
                        user={user}
                        authorName={user.name}
                        content={""}
                        replyText={replyText}
                        setReplyText={setReplyText}
                        handleAddReply={handleAddReply}
                        handleCancelReply={handleCancelReply}
                        disableAutoGen
                        type="new"
                      />
                    </div>
                  )}


                  {comments?.length > 0 &&
                    comments.map((comment) => (
                      <CommentInfoCard
                        key={comment._id}
                        commentId={comment._id || null}
                        authorName={comment.author.name}
                        authorPhoto={comment.author.profileImageUrl}
                        content={comment.content}
                        updatedOn={
                          comment.updatedAt
                            ? moment(comment.updatedAt).format("Do MMM YYYY")
                            : "-"
                        }
                        post={comment.post}
                        replies={comment.replies || []}
                        getAllComments={() =>
                          fetchCommentByPostId(blogPostData._id)
                        }
                        onDelete={(commentId) =>
                          setOpenDeleteAlert({
                            open: true,
                            data: commentId || comment._id,
                          })
                        }
                      />
                    ))}

                </div>

              </div>

              <LikeCommentButton
                postId={blogPostData._id || ""}
                likes={blogPostData.likes || 0}
                comments={comments?.length || 0}
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <TrendingPostsSection />
            </div>
          </div>

          <Drawer
            isOpen={openSummarizeDrawer}
            onClose={() => setOpenSummarizeDrawer(false)}
            title={!isLoading && summaryContent?.title}
          >
            {errorMsg && (
              <p className="flex gap-2 text-sm text-amber-600 font-medium">
                <LuCircleAlert className="mt-1" /> {errorMsg}
              </p>
            )}
            {isLoading && <SkeletonLoader />}
            {!isLoading && summaryContent && (
              <MarkdownContent content={summaryContent?.summary || ""} />
            )}
          </Drawer>
        </>
      )}
    </BlogLayout>
  )
}

export default BlogPostView