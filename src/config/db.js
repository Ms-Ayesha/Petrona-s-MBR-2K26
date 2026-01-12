// config/db.js
const mongoose = require("mongoose");

let cachedConnection = null;

const connectDB = async () => {
  // If we already have a working connection → reuse it (very important in Lambda)
  if (cachedConnection && mongoose.connection.readyState >= 1) {
    console.log("Reusing existing MongoDB connection");
    return cachedConnection;
  }

  try {
    const options = {
      dbName: "MBR_2K26",
      connectTimeoutMS: 20000,          // Give cold starts more time
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,  // Fail faster if Mongo is unreachable
      maxPoolSize: 5,                   // Reasonable for Lambda (adjust if needed)
      minPoolSize: 1,
      // bufferCommands: false,         // Uncomment if you want to fail immediately instead of buffering
    };

    console.log("Attempting to connect to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`MongoDB Connected Successfully → Host: ${conn.connection.host}`);

    cachedConnection = conn;

    // Helpful event listeners for debugging
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connection event: connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection event: error", err.message);
      cachedConnection = null; // Force reconnect next time
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose connection event: disconnected → will reconnect on next request");
      cachedConnection = null;
    });

    return conn;
  } catch (error) {
    console.error("MongoDB Connection FAILED:", error.message);
    console.error(error.stack); // more details in CloudWatch
    throw error; // Let the caller handle it (return 500)
  }
};

module.exports = connectDB;