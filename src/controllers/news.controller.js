const News = require("../models/news.model");

const createNew = async (req, res) => {
    try {
        const { image, text1, text2 } = req.body;

        const news = await News.create({
            image,
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

const updateNew = async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!news) {
            return res.status(404).json({
                success: false,
                message: "News not found",
            });
        }

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

const deleteNew = async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: "News not found",
            });
        }

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
