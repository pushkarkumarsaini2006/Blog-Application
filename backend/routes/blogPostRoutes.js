const express = require("express");
const router = express.Router();
const {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostBySlug,
  getPostsByTag,
  searchPosts,
  incrementView,
  likePost,
  getTopPosts,
} = require("../controllers/blogPostController");
const { protect } = require("../middlewares/authMiddleware");
const { limitPostAttempts } = require("../middlewares/rateLimitMiddleware");

router.post("/", protect, limitPostAttempts, createPost);
router.get("/", getAllPosts);
router.get("/slug/:slug", getPostBySlug);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.get("/tag/:tag", getPostsByTag);
router.get("/search", searchPosts);
router.post("/:id/view", incrementView);
router.post("/:id/like", likePost);
router.get("/trending", getTopPosts);

module.exports = router;
