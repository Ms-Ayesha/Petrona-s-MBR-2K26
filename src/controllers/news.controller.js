// controllers/news.controller.js
const News = require("../models/news.model");
const cloudinary = require("../config/cloudinary");

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = async (fileBuffer, folder) => {
  const streamifier = require("streamifier");

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const createNew = async (req, res) => {
  try {
    const { text1, text2 } = req.body;

    if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });

    const result = await uploadToCloudinary(req.file.buffer, "news_images");

    const news = await News.create({
      image: result.secure_url,
      text1,
      text2,
    });

    res.status(201).json({ success: true, message: "News created", data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getNewById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: "News not found" });
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateNew = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "news_images");
      updateData.image = result.secure_url;
    }

    const news = await News.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!news) return res.status(404).json({ success: false, message: "News not found" });

    res.status(200).json({ success: true, message: "News updated", data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteNew = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: "News not found" });
    res.status(200).json({ success: true, message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createNew, getAllNews, getNewById, updateNew, deleteNew };
