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
app.use(express.json());

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// DB connection middleware
// in src/app.js
const ensureDBConnected = async (req, res, next) => {
  try {
    await connectDB(); // now safe & fast on warm invocations
    next();
  } catch (err) {
    console.error("DB connection error in middleware:", err.message);
    return res.status(503).json({
      success: false,
      message: "Database connection unavailable – please try again soon",
    });
  }
};


app.use("/api", ensureDBConnected);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/news", newRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
