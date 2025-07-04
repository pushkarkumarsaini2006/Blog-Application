const BlogPost = require("../models/BlogPost");
const Comment = require("../models/Comment");

// @desc    Dashboard summary
// @route   POST /api/dashboard-summary
// @access  Private (Admin only)
const getDashboardSummary = async (req, res) => {
  try {
     // Basic counts
    const [totalPosts, drafts, published, totalComments, aiGenerated] =
      await Promise.all([
        BlogPost.countDocuments(),
        BlogPost.countDocuments({ isDraft: true }),
        BlogPost.countDocuments({ isDraft: false }),
        Comment.countDocuments(),
        BlogPost.countDocuments({ generatedByAI: true }),
      ]);

    const totalViewsAgg = await BlogPost.aggregate([
      { $group: { _id: null, total: { $sum: "$views" } } },
    ]);
    const totalLikesAgg = await BlogPost.aggregate([
      { $group: { _id: null, total: { $sum: "$likes" } } },
    ]);
    const totalViews = totalViewsAgg[0]?.total || 0;
    const totalLikes = totalLikesAgg[0]?.total || 0;

    // Top performing posts
    const topPosts = await BlogPost.find({ isDraft: false })
      .select("title coverImageUrl views likes")
      .sort({ views: -1, likes: -1 })
      .limit(5);

    // Recent comments
    const recentComments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("author", "name profileImageUrl")
      .populate("post", "title coverImageUrl");

    // Tag usage aggregation
    const tagUsage = await BlogPost.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $project: { tag: "$_id", count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      stats: {
        totalPosts,
        drafts,
        published,
        totalViews,
        totalLikes,
        totalComments,
        aiGenerated,
      },
      topPosts,
      recentComments,
      tagUsage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
};

module.exports = { getDashboardSummary };
