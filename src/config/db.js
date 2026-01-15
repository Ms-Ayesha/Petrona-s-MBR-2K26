// src/config/db.js
const mongoose = require("mongoose");

let cachedConnection = null;
let isConnecting = false;

const connectDB = async () => {
  // Already connected → reuse
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  // Already connecting → wait for it (prevents multiple parallel attempts)
  if (isConnecting) {
    console.log("Waiting for existing MongoDB connection...");
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (mongoose.connection.readyState === 1) {
          clearInterval(check);
          resolve(cachedConnection);
        }
      }, 100);
    });
  }

  isConnecting = true;
  console.log("Establishing MongoDB connection...");

  try {
    const options = {
      dbName: "MBR_2K26",
      connectTimeoutMS: 30000,          // more generous for cold starts
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      maxPoolSize: 3,                   // very conservative for Vercel
      minPoolSize: 0,
      maxIdleTimeMS: 10000,             // close idle connections faster
      family: 4,                        // prefer IPv4 (helps in some regions)
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`MongoDB Connected → ${conn.connection.host}`);

    cachedConnection = conn;

    // Reset connecting flag
    isConnecting = false;

    // Debug listeners
    mongoose.connection.on("error", (err) => {
      console.error("Mongoose error:", err.message);
      cachedConnection = null;
      isConnecting = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected → next request will reconnect");
      cachedConnection = null;
      isConnecting = false;
    });

    return conn;
  } catch (err) {
    isConnecting = false;
    console.error("MongoDB connection failed:", err.message);
    throw err; // caller should catch & return 503 / 500
  }
};

module.exports = connectDB;