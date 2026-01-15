// src/config/db.js
const mongoose = require('mongoose');

let cachedConnection = null;
let isConnecting = false;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Reusing existing MongoDB connection');
    return cachedConnection;
  }

  if (isConnecting) {
    console.log('Waiting for ongoing MongoDB connection...');
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (mongoose.connection.readyState === 1) {
          clearInterval(interval);
          resolve(cachedConnection);
        }
      }, 200);
    });
  }

  isConnecting = true;
  console.log('Connecting to MongoDB Atlas...');

  try {
    const options = {
      dbName: 'MBR_2K26',
      connectTimeoutMS: 45000,           // increased
      serverSelectionTimeoutMS: 45000,   // increased (critical!)
      socketTimeoutMS: 60000,
      maxPoolSize: 3,                    // small pool for serverless
      minPoolSize: 0,
      maxIdleTimeMS: 10000,
      family: 4,                         // force IPv4 (helps in some regions)
      retryWrites: true,                 // already in URI, but explicit
      // compressors: ['zlib'],          // optional: can help if bandwidth-limited
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`MongoDB Connected → Host: ${conn.connection.host}`);

    cachedConnection = conn;
    isConnecting = false;

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose error:', err.message);
      cachedConnection = null;
      isConnecting = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
      cachedConnection = null;
      isConnecting = false;
    });

    return conn;
  } catch (error) {
    isConnecting = false;
    console.error('MongoDB connection FAILED:', error.message);
    console.error(error.stack);
    throw error;
  }
};

module.exports = connectDB;