// index.js / server.js / app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // your updated db file

// Import routes
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const itemRoutes = require("./routes/catelog.routes"); // note: probably typo → catalog.routes?
const newRoutes = require("./routes/news.routes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Optional: global error handler (good practice)
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// IMPORTANT: Do NOT call connectDB() here at the top level anymore!
// We will connect lazily inside routes or via middleware

// Option 1: Add DB connection middleware to all API routes (recommended)
const ensureDBConnected = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failed in middleware:", err.message);
    res.status(503).json({ 
      message: "Database service is temporarily unavailable. Please try again later." 
    });
  }
};

// Apply to all API routes
app.use("/api", ensureDBConnected);

// Or apply individually if you prefer:
// app.use("/api/auth", ensureDBConnected, authRoutes);
// app.use("/api/admin", ensureDBConnected, adminRoutes);
// etc.

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/news", newRoutes);

// Optional: health check endpoint (very useful in Lambda / ECS / etc.)
app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({
    status: "ok",
    database: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// For Lambda: export the app (using serverless-http or similar)
module.exports = app;

// If you're running locally with node:
// (uncomment for local dev)
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });