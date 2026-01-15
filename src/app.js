const dotenv = require("dotenv");
dotenv.config(); // Must be first

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const itemRoutes = require("./routes/catelog.routes");
const newRoutes = require("./routes/news.routes");

const app = express();

app.use(cors());

/**
 * ✅ Body parser (multer-safe, Vercel-safe)
 * Must be BEFORE routes
 */
app.use((req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    return next(); // multer will handle it
  }
  express.json()(req, res, next);
});

/**
 * ✅ DB connection middleware
 */
const ensureDBConnected = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failed:", err.message);
    res.status(503).json({
      success: false,
      message: "Database service temporarily unavailable",
    });
  }
};

app.use("/api", ensureDBConnected);

/**
 * ✅ Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/news", newRoutes);

/**
 * ✅ Health check
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * ✅ Global error handler (MUST BE LAST)
 */
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong on the server",
  });
});

module.exports = app;
