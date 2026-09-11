const express = require("express");
const router = express.Router();
const {
  addComment,
  getCommentsByPost,
  deleteComment,
  getAllComments,
} = require("../controllers/commentController");
const { protect } = require("../middlewares/authMiddleware");
const { limitCommentAttempts } = require("../middlewares/rateLimitMiddleware");

router.post("/:postId", protect, limitCommentAttempts, addComment);
router.get("/:postId", getCommentsByPost);
router.get("/", getAllComments);
router.delete("/:commentId", protect, deleteComment);

module.exports = router;
