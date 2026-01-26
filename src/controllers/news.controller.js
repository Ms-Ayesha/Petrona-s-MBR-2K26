const News = require("../models/news.model");
const cloudinary = require("../config/cloudinary");

/* ===== CREATE NEWS ===== */
const createNew = async (req, res) => {
    try {
        const { text1, text2 } = req.body;

        // Validation
        if (!text1 || !text2) {
            return res.status(400).json({
                success: false,
                message: "text1 and text2 are required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }

        const news = await News.create({
            image: req.file.path,
            cloudinaryId: req.file.cloudinaryId,
            text1,
            text2,
        });

        res.status(201).json({
            success: true,
            message: "News created successfully",
            data: news,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ===== GET ALL NEWS ===== */
const getAllNews = async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: news,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ===== GET SINGLE NEWS ===== */
const getNewById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: "News not found",
            });
        }

        res.status(200).json({
            success: true,
            data: news,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ===== UPDATE NEWS ===== */
const updateNew = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: "News not found",
            });
        }

        // Update text fields
        if (req.body.text1) news.text1 = req.body.text1;
        if (req.body.text2) news.text2 = req.body.text2;

        // If new image uploaded
        if (req.file) {
            // Delete old image from Cloudinary
            await cloudinary.uploader.destroy(news.cloudinaryId);

            // Update with new image
            news.image = req.file.path;
            news.cloudinaryId = req.file.cloudinaryId;
        }

        await news.save();

        res.status(200).json({
            success: true,
            message: "News updated successfully",
            data: news,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ===== DELETE NEWS ===== */
const deleteNew = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: "News not found",
            });
        }

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(news.cloudinaryId);

        // Delete from DB
        await news.deleteOne();

        res.status(200).json({
            success: true,
            message: "News deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createNew,
    getAllNews,
    getNewById,
    updateNew,
    deleteNew,
};
