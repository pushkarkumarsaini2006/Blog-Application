const signupAttempts = new Map();
const commentAttempts = new Map();
const postAttempts = new Map();

const createRateLimiter = (store, limit, windowMs) => (req, res, next) => {
  const key = req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress || "unknown";
  const now = Date.now();
  const windowStart = now - windowMs;

  const attempts = (store.get(key) || []).filter((timestamp) => timestamp > windowStart);
  attempts.push(now);
  store.set(key, attempts);

  if (attempts.length > limit) {
    return res.status(429).json({
      message: "Too many requests. Please wait and try again.",
    });
  }

  next();
};

const limitSignupAttempts = createRateLimiter(signupAttempts, 5, 15 * 60 * 1000);
const limitCommentAttempts = createRateLimiter(commentAttempts, 20, 10 * 60 * 1000);
const limitPostAttempts = createRateLimiter(postAttempts, 10, 10 * 60 * 1000);

module.exports = {
  limitSignupAttempts,
  limitCommentAttempts,
  limitPostAttempts,
};
