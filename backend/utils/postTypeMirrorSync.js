const BlogPost = require("../models/BlogPost");
const ThoughtPost = require("../models/ThoughtPost");
const NewsPost = require("../models/NewsPost");

const buildMirrorPayload = (post) => ({
  sourcePostId: post._id,
  title: post.title,
  slug: post.slug,
  postType: post.postType,
  content: post.content,
  coverImageUrl: post.coverImageUrl || null,
  tags: Array.isArray(post.tags) ? post.tags : [],
  author: post.author,
  isDraft: Boolean(post.isDraft),
  views: Number(post.views || 0),
  likes: Number(post.likes || 0),
  generatedByAI: Boolean(post.generatedByAI),
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

const upsertMirror = async (model, post) => {
  const payload = buildMirrorPayload(post);

  await model.updateOne(
    { sourcePostId: post._id },
    { $set: payload },
    { upsert: true }
  );
};

const syncPostTypeMirrors = async (post, previousType = null) => {
  if (!post || !post._id) {
    return;
  }

  const currentType = post.postType;

  if (previousType === "thought" && currentType !== "thought") {
    await ThoughtPost.deleteOne({ sourcePostId: post._id });
  }
  if (previousType === "news" && currentType !== "news") {
    await NewsPost.deleteOne({ sourcePostId: post._id });
  }

  if (currentType === "thought") {
    await upsertMirror(ThoughtPost, post);
    await NewsPost.deleteOne({ sourcePostId: post._id });
    return;
  }

  if (currentType === "news") {
    await upsertMirror(NewsPost, post);
    await ThoughtPost.deleteOne({ sourcePostId: post._id });
    return;
  }

  await ThoughtPost.deleteOne({ sourcePostId: post._id });
  await NewsPost.deleteOne({ sourcePostId: post._id });
};

const deletePostTypeMirrors = async (sourcePostId) => {
  if (!sourcePostId) {
    return;
  }

  await Promise.all([
    ThoughtPost.deleteOne({ sourcePostId }),
    NewsPost.deleteOne({ sourcePostId }),
  ]);
};

const syncAllPostTypeMirrors = async () => {
  const posts = await BlogPost.find({}).lean();

  const thoughtPosts = posts.filter((post) => post.postType === "thought");
  const newsPosts = posts.filter((post) => post.postType === "news");

  if (thoughtPosts.length > 0) {
    await ThoughtPost.bulkWrite(
      thoughtPosts.map((post) => ({
        updateOne: {
          filter: { sourcePostId: post._id },
          update: { $set: buildMirrorPayload(post) },
          upsert: true,
        },
      }))
    );
  }

  if (newsPosts.length > 0) {
    await NewsPost.bulkWrite(
      newsPosts.map((post) => ({
        updateOne: {
          filter: { sourcePostId: post._id },
          update: { $set: buildMirrorPayload(post) },
          upsert: true,
        },
      }))
    );
  }

  const thoughtIds = thoughtPosts.map((post) => post._id);
  const newsIds = newsPosts.map((post) => post._id);

  if (thoughtIds.length > 0) {
    await ThoughtPost.deleteMany({ sourcePostId: { $nin: thoughtIds } });
  } else {
    await ThoughtPost.deleteMany({});
  }

  if (newsIds.length > 0) {
    await NewsPost.deleteMany({ sourcePostId: { $nin: newsIds } });
  } else {
    await NewsPost.deleteMany({});
  }
};

module.exports = {
  syncPostTypeMirrors,
  deletePostTypeMirrors,
  syncAllPostTypeMirrors,
};
