const Video = require("../models/video.model");

const createVideo = async (req, res) => {
    try {
        const { videoUrl, timestamps, day } = req.body;

        if (!videoUrl || !day)
            return res.status(400).json({ message: "Video URL and day are required" });

        const exists = await Video.findOne({ day });
        if (exists)
            return res.status(400).json({ message: "Video already exists for this day" });

        const video = await Video.create({ videoUrl, timestamps, day });
        res.status(201).json(video);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVideoByDay = async (req, res) => {
    try {
        const video = await Video.findOne({ day: req.params.dayId });
        if (!video)
            return res.status(404).json({ message: "Video not found" });

        res.json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video)
            return res.status(404).json({ message: "Video not found" });

        res.json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateVideo = async (req, res) => {
    try {
        const updated = await Video.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated)
            return res.status(404).json({ message: "Video not found" });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteVideo = async (req, res) => {
    try {
        const deleted = await Video.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: "Video not found" });

        res.json({ message: "Video deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createVideo,
    getVideoByDay,
    getVideoById,
    updateVideo,
    deleteVideo
};
