const { GoogleGenAI } = require("@google/genai");
const {
  blogPostIdeasPrompt,
  generateReplyPrompt,
  blogSummaryPrompt,
} = require("../utils/prompts");

const AI_MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  "gemini-2.0-flash",
  "gemini-1.5-flash",
].filter(Boolean);

const getAIClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    const err = new Error("GEMINI_API_KEY is not configured on the server");
    err.statusCode = 503;
    throw err;
  }

  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

const generateWithFallbackModel = async (prompt) => {
  const ai = getAIClient();
  let lastError = null;

  for (const model of AI_MODEL_CANDIDATES) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const text = response?.text?.trim?.() || "";
      if (!text) {
        throw new Error("Empty response received from AI model");
      }

      return text;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to generate AI content");
};

const extractJSONArray = (value) => {
  const cleaned = (value || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const directParse = () => JSON.parse(cleaned);
  try {
    const parsed = directParse();
    if (Array.isArray(parsed)) return parsed;
  } catch (err) {
    // Continue with bracket extraction fallback.
  }

  const firstBracket = cleaned.indexOf("[");
  const lastBracket = cleaned.lastIndexOf("]");
  if (firstBracket === -1 || lastBracket === -1 || lastBracket <= firstBracket) {
    throw new Error("AI response did not contain a valid JSON array");
  }

  const jsonPart = cleaned.slice(firstBracket, lastBracket + 1);
  const parsed = JSON.parse(jsonPart);
  if (!Array.isArray(parsed)) {
    throw new Error("AI response JSON is not an array");
  }

  return parsed;
};

const extractJSONObject = (value) => {
  const cleaned = (value || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    // Continue with brace extraction fallback.
  }

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("AI response did not contain a valid JSON object");
  }

  const jsonPart = cleaned.slice(firstBrace, lastBrace + 1);
  const parsed = JSON.parse(jsonPart);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("AI response JSON is not an object");
  }

  return parsed;
};

const toTagSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 24);

const deriveProfileTopics = (user = {}) => {
  const fromBio = String(user.bio || "")
    .split(/[,.|/]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 2)
    .slice(0, 3);

  if (fromBio.length > 0) {
    return fromBio;
  }

  const fallbackFromName = String(user.name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 1)
    .map((namePart) => `${namePart}'s interests`);

  return fallbackFromName;
};

const buildLocalIdeas = (topics, options = {}) => {
  const topicText = String(topics || "technology").trim();
  const profileName = String(options.profileName || "").trim();
  const refreshToken = String(options.refreshToken || "").trim();

  const topicTokens = topicText
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const firstTopic = topicTokens[0] || "Modern Web Development";
  const secondTopic = topicTokens[1] || "Developer Productivity";

  const baseIdeas = [
    {
      title: `Practical ${firstTopic} Trends to Watch This Year${profileName ? ` for ${profileName}` : ""}`,
      description:
        "A focused look at what is changing quickly and what actually matters in real projects. Includes examples you can apply right away.",
      tags: [toTagSlug(firstTopic), "industry-news", "best-practices"],
      tone: "professional",
    },
    {
      title: `Beginner Guide: Getting Started with ${firstTopic}`,
      description:
        "A step-by-step starter roadmap for newcomers, including common mistakes and quick wins for faster learning.",
      tags: [toTagSlug(firstTopic), "beginner", "guide"],
      tone: "beginner-friendly",
    },
    {
      title: `${secondTopic}: What Worked for Us in Production`,
      description:
        "A practical thought piece with implementation lessons, trade-offs, and outcomes from a real-world setup.",
      tags: [toTagSlug(secondTopic), "thoughts", "case-study"],
      tone: "casual",
    },
    {
      title: `Top 7 Tools to Improve ${firstTopic} Workflows`,
      description:
        "A curated list of tools and patterns that reduce friction and improve team velocity while maintaining quality.",
      tags: [toTagSlug(firstTopic), "tools", "productivity"],
      tone: "technical",
    },
    {
      title: `Future of ${firstTopic}: News, Signals, and Predictions`,
      description:
        "A forward-looking analysis of current market signals and how teams can prepare for upcoming shifts.",
      tags: [toTagSlug(firstTopic), "news", "future"],
      tone: "insightful",
    },
  ];

  if (!refreshToken) {
    return baseIdeas;
  }

  const rotationSeed = Array.from(refreshToken).reduce(
    (acc, ch) => acc + ch.charCodeAt(0),
    0
  );
  const offset = rotationSeed % baseIdeas.length;

  return [...baseIdeas.slice(offset), ...baseIdeas.slice(0, offset)];
};

const buildLocalBlogPost = (title, tone) => {
  const safeTitle = String(title || "Untitled Post").trim();
  const safeTone = String(tone || "clear").trim();

  return `# ${safeTitle}

## Introduction

In this article, we explore **${safeTitle}** with a ${safeTone} tone. The goal is to provide practical guidance you can apply immediately.

## Why This Matters

- Teams need reliable patterns that scale.
- Developers benefit from repeatable workflows.
- Good decisions come from understanding trade-offs.

## Core Concepts

1. Define the problem before choosing tools.
2. Keep architecture simple until complexity is proven necessary.
3. Measure outcomes and iterate continuously.

## Example

\`\`\`js
function planFeature(name) {
  return {
    name,
    scope: "small",
    validated: true,
  };
}
\`\`\`

## Conclusion

${safeTitle} works best when you focus on clarity, incremental delivery, and measurable improvements. Start small, validate quickly, and refine as you learn.`;
};

const buildLocalReply = (content, author) => {
  const authorName = author?.name || "there";
  const snippet = String(content || "").slice(0, 120);
  return `Thanks ${authorName} for sharing your thoughts. You raised a great point${snippet ? ` about "${snippet}${snippet.length >= 120 ? "..." : ""}"` : ""}. I agree that balancing practicality with long-term maintainability is key, and your comment adds helpful perspective.`;
};

const buildLocalSummary = (content) => {
  const safeContent = String(content || "").replace(/\s+/g, " ").trim();
  const preview = safeContent.slice(0, 280);
  return {
    title: "Quick Practical Summary",
    summary: `${preview}${safeContent.length > 280 ? "..." : ""}\n\n## What You'll Learn\n- The main idea and its context\n- Practical steps to apply immediately\n- Key trade-offs to consider before implementation`,
  };
};

// @desc    Generate blog content from title
// @route   POST /api/ai/generate
// @access  Private
const generateBlogPost = async (req, res) => {
  try {
    const { title, tone } = req.body;

    if (!title || !tone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = `Write a markdown-formatted blog post titled "${title}". Use a ${tone} tone. Include an introduction, subheadings, code examples if relevant, and a conclusion.`;
    const rawText = await generateWithFallbackModel(prompt);
    res.status(200).json(rawText);
  } catch (error) {
    console.error("AI generateBlogPost failed, returning local fallback:", error.message);
    const { title, tone } = req.body;
    return res.status(200).json(buildLocalBlogPost(title, tone));
  }
};

// @desc    Generate blog post ideas from title
// @route   POST /api/ai/generate-ideas
// @access  Private
const generateBlogPostIdeas = async (req, res) => {
  try {
    const { topics, refreshToken } = req.body;

    if (!topics) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = req.user || {};
    const profileTopics = deriveProfileTopics(user);
    const finalTopics = [
      ...new Set(
        [topics, ...profileTopics]
          .join(",")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      ),
    ].join(", ");

    const prompt = blogPostIdeasPrompt(finalTopics, {
      profileName: user.name,
      profileBio: user.bio,
      refreshToken,
    });
    const rawText = await generateWithFallbackModel(prompt);
    const data = extractJSONArray(rawText);

    res.status(200).json(data);
  } catch (error) {
    console.error("AI generateBlogPostIdeas failed, returning local fallback:", error.message);
    const { topics, refreshToken } = req.body;
    const user = req.user || {};
    const profileTopics = deriveProfileTopics(user);
    const finalTopics = [topics, ...profileTopics]
      .filter(Boolean)
      .join(", ");

    return res.status(200).json(
      buildLocalIdeas(finalTopics, {
        profileName: user.name,
        refreshToken,
      })
    );
  }
};

// @desc    Generate comment reply
// @route   POST /api/ai/generate-reply
// @access  Private
const generateCommentReply = async (req, res) => {
  try {
    const { author, content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = generateReplyPrompt({ author, content });
    const rawText = await generateWithFallbackModel(prompt);
    res.status(200).json(rawText);
  } catch (error) {
    console.error("AI generateCommentReply failed, returning local fallback:", error.message);
    const { author, content } = req.body;
    return res.status(200).json(buildLocalReply(content, author));
  }
};

// @desc    Generate blog post summary
// @route   POST /api/ai/generate-summary
// @access  Private
const generatePostSummary = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = blogSummaryPrompt(content);
    const rawText = await generateWithFallbackModel(prompt);
    const data = extractJSONObject(rawText);
    res.status(200).json(data);
  } catch (error) {
    console.error("AI generatePostSummary failed, returning local fallback:", error.message);
    const { content } = req.body;
    return res.status(200).json(buildLocalSummary(content));
  }
};

module.exports = {
  generateBlogPost,
  generateBlogPostIdeas,
  generateCommentReply,
  generatePostSummary
};
