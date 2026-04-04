const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      postType: {
        type: String,
        enum: ["blog", "news", "thought"],
        default: "thought",
      },
      content: { type: String, required: true }, // markdown
      coverImageUrl: { type: String, default: null },
      tags: [{ type: String }],
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      isDraft: { type: Boolean, default: false },
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      generatedByAI: { type: Boolean, default: false },
    },
    { timestamps: true, collection: "post" }
  );
  
module.exports = mongoose.model("BlogPost", BlogPostSchema);
  