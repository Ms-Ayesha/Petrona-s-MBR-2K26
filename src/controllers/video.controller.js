const Video = require("../models/video.model");
const Day = require("../models/day.model");

const createVideo = async (req, res) => {
    const { dayId } = req.params;
    const { url, timestamps } = req.body;
    if (!url) {
        return res.status(400).json({ message: "Video URL is required" });
    }
    try {
        const day = await Day.findById(dayId);
        if (!day) {
            return res.status(404).json({ message: "Day not found" });
        }

        const existingVideo = await Video.findOne({ day: dayId });
        if (existingVideo) {
            return res.status(400).json({ message: "Video already exists for this day" });
        }
        const video = await Video.create({ day: dayId, url, timestamps });
        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ message: "Error creating video" });
    }
};

const getVideoByDay = async (req, res) => {
    const { dayId } = req.params;
    try {
        const video = await Video.findOne({ day: dayId });
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: "Error fetching video" });
    }
};

const getVideoById = async (req, res) => {
    const { id } = req.params;
    try {
        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: "Error fetching video" });
    }
};

const updateVideo = async (req, res) => {
    const { id } = req.params;
    const { url, timestamps } = req.body;
    try {
        const video = await Video.findByIdAndUpdate(
            id,
            { url, timestamps },
            { new: true }
        );
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: "Error updating video" });
    }
};

const deleteVideo = async (req, res) => {
    const { id } = req.params;
    try {
        const video = await Video.findByIdAndDelete(id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        res.json({ message: "Video deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting video" });
    }
};

module.exports = {
    createVideo,
    getVideoByDay,
    getVideoById,
    updateVideo,
    deleteVideo
};