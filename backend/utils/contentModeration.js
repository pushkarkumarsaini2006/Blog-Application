const SPAM_KEYWORDS = [
  "investment",
  "crypto",
  "forex",
  "loan",
  "casino",
  "lottery",
  "winner",
  "click here",
  "guaranteed",
  "work from home",
  "earn money fast",
  "telegram",
  "whatsapp",
  "http://",
  "https://",
  "www.",
];

const PROFANITY_KEYWORDS = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "scam",
  "fraud",
  "spam",
];

const normalize = (value = "") => String(value || "").toLowerCase().trim();

const countMatches = (value, regex) => {
  const matches = String(value || "").match(regex);
  return matches ? matches.length : 0;
};

const hasRepeatedCharacters = (value) => /(.)\1{5,}/i.test(String(value || ""));

const getContentModerationResult = (input = "") => {
  const text = normalize(input);
  const issues = [];

  if (!text) {
    issues.push("Content cannot be empty.");
    return { allowed: false, issues };
  }

  const urlCount = countMatches(text, /(https?:\/\/|www\.)/gi);
  if (urlCount > 1) {
    issues.push("Please do not include multiple links.");
  }

  if (SPAM_KEYWORDS.some((keyword) => text.includes(keyword))) {
    issues.push("Content looks promotional or spam-like.");
  }

  if (PROFANITY_KEYWORDS.some((keyword) => text.includes(keyword))) {
    issues.push("Content contains disallowed language.");
  }

  if (hasRepeatedCharacters(text)) {
    issues.push("Content contains repeated characters that look spammy.");
  }

  const capsRatio = String(input || "").replace(/[^A-Z]/g, "").length / Math.max(String(input || "").replace(/\s+/g, "").length, 1);
  if (capsRatio > 0.55 && String(input || "").length > 20) {
    issues.push("Please avoid writing in excessive uppercase.");
  }

  return {
    allowed: issues.length === 0,
    issues,
  };
};

const isLikelyFakeSignup = ({ name, email, password, honeypot }) => {
  const issues = [];

  if (String(honeypot || "").trim()) {
    issues.push("Bot detection field was filled.");
  }

  const normalizedName = normalize(name);
  if (normalizedName.length < 2) {
    issues.push("Name is too short.");
  }

  if (countMatches(email, /@/g) !== 1 || !String(email || "").includes(".")) {
    issues.push("Email format looks invalid.");
  }

  if ((password || "").length < 8) {
    issues.push("Password should be at least 8 characters.");
  }

  if (SPAM_KEYWORDS.some((keyword) => normalize(name).includes(keyword))) {
    issues.push("Name looks suspicious.");
  }

  return {
    allowed: issues.length === 0,
    issues,
  };
};

module.exports = {
  getContentModerationResult,
  isLikelyFakeSignup,
};
