
const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { limitSignupAttempts } = require("../middlewares/rateLimitMiddleware");
const multer = require("multer");

const router = express.Router();

// Auth Routes
router.post("/register", limitSignupAttempts, registerUser);   // Register User
router.post("/login", loginUser);         // Login User
router.get("/profile", protect, getUserProfile);  // Get User Profile


router.post("/upload-image", (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) return next(error);
    next();
  });
}, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  
  // Force HTTPS for production, especially on Render
  const forceHttps = process.env.FORCE_HTTPS === 'true' || process.env.NODE_ENV === 'production';
  const protocol = forceHttps ? 'https' : req.protocol;
  const host = req.get("host");
  
  const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError || error.message?.startsWith("Only .")) {
    return res.status(400).json({ message: error.message });
  }
  next(error);
});

module.exports = router;
