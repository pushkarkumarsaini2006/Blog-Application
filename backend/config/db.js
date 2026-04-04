const mongoose = require("mongoose");
const { syncAllPostTypeMirrors } = require("../utils/postTypeMirrorSync");

const ensurePostCollectionName = async () => {
  const db = mongoose.connection.db;
  if (!db) {
    return;
  }

  const collectionInfos = await db.listCollections({}, { nameOnly: true }).toArray();
  const collectionNames = collectionInfos.map((item) => item.name);

  const hasLegacyBlogPosts = collectionNames.includes("blogposts");
  const hasPost = collectionNames.includes("post");

  if (!hasLegacyBlogPosts || hasPost) {
    return;
  }

  await db.collection("blogposts").rename("post");
  console.log("Renamed MongoDB collection 'blogposts' to 'post'");
};

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI:", process.env.MONGO_URI ? "URI is set" : "URI is missing");
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    console.log("MongoDB connected successfully");
    
    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    try {
      await ensurePostCollectionName();
    } catch (renameError) {
      console.error("Failed to rename blogposts collection:", renameError.message);
    }

    try {
      await syncAllPostTypeMirrors();
      console.log("Thought/News mirror collections synced successfully");
    } catch (syncError) {
      console.error("Failed to sync thought/news mirror collections:", syncError.message);
    }
    
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    console.error("Full error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
