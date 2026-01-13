// app.js (or index.js / server.js)
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const itemRoutes = require("./routes/catelog.routes"); // consider renaming to catalog.routes
const newRoutes = require("./routes/news.routes");

// ────────────────────────────────────────────────
dotenv.config();  // MUST come first

// Configure cloudinary HERE — immediately after dotenv
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Quick debug log (keep for now, remove later)
console.log("Cloudinary loaded with:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "MISSING",
  api_key:    process.env.CLOUDINARY_API_KEY    ? "present" : "MISSING",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "present" : "MISSING",
});
// ────────────────────────────────────────────────

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Your global error handler...
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// DB lazy connection middleware
const ensureDBConnected = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failed:", err.message);
    res.status(503).json({ 
      message: "Database service temporarily unavailable" 
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
  // Note: mongoose is not imported here — add if needed or remove dbStatus
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// For local development (uncomment if needed)
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;