#!/usr/bin/env node

require("dotenv").config();
const mongoose = require("mongoose");

console.log("🧪 Testing database connection...");
console.log("Environment:", process.env.NODE_ENV);
console.log("MongoDB URI:", process.env.MONGO_URI ? "✅ Set" : "❌ Missing");

const testConnection = async () => {
  try {
    console.log("🔄 Attempting to connect to MongoDB...");
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    });
    
    console.log("✅ MongoDB connected successfully!");
    console.log("Database name:", mongoose.connection.db.databaseName);
    console.log("Connection state:", mongoose.connection.readyState);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📚 Available collections:", collections.map(c => c.name));
    
    process.exit(0);
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error("Error:", error.message);
    console.error("Code:", error.code);
    process.exit(1);
  }
};

testConnection();
