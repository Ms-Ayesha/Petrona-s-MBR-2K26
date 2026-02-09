const dotenv = require("dotenv");
dotenv.config(); // Must be first

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");

const itemRoutes = require("./routes/catelog.routes");
const newRoutes = require("./routes/news.routes");
const contactRoutes = require("./routes/contact.routes");

const stationPdf = require("./routes/stationPdf.routes");
const stationMail = require("./routes/stationMail.routes");

const yearRoutes = require("./routes/year.routes");
const sectionRoutes = require("./routes/section.routes");
const dayRoutes = require("./routes/day.routes");
const videoRoutes = require("./routes/video.routes");
const galleryRoutes = require("./routes/gallery.routes");


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
const ensureDBConnected = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failed:", err.message);
    res.status(503).json({ message: "Database service temporarily unavailable" });
  }
};

app.use("/api", ensureDBConnected);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/items", itemRoutes);
app.use("/api/news", newRoutes);
app.use("/api/contacts", contactRoutes);

app.use("/api/stationPdf", stationPdf);
app.use("/api/stationMail", stationMail);

app.use("/api/years", yearRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/days", dayRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/gallery", galleryRoutes);
app.use('/images', express.static('public/images'));



// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;
