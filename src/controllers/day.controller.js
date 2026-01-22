const Day = require("../models/day.model");
const Year = require("../models/year.model");

const createDay = async (req, res) => {
    const { yearId } = req.params;
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }
    try {
        const year = await Year.findById(yearId);
        if (!year) {
            return res.status(404).json({ message: "Year not found" });
        }
        const day = await Day.create({ year: yearId, title });
        res.status(201).json(day);
    } catch (error) {
        res.status(500).json({ message: "Error creating day" });
    }
};

const getDaysByYear = async (req, res) => {
    const { yearId } = req.params;
    try {
        const days = await Day.find({ year: yearId }).sort({ createdAt: 1 });
        res.json(days);
    } catch (error) {
        res.status(500).json({ message: "Error fetching days" });
    }
};

const getDayById = async (req, res) => {
    const { id } = req.params;
    try {
        const day = await Day.findById(id);
        if (!day) {
            return res.status(404).json({ message: "Day not found" });
        }
        res.json(day);
    } catch (error) {
        res.status(500).json({ message: "Error fetching day" });
    }
};

const updateDay = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
        const day = await Day.findByIdAndUpdate(id, { title }, { new: true });
        if (!day) {
            return res.status(404).json({ message: "Day not found" });
        }
        res.json(day);
    } catch (error) {
        res.status(500).json({ message: "Error updating day" });
    }
};

const deleteDay = async (req, res) => {
    const { id } = req.params;
    try {
        const day = await Day.findByIdAndDelete(id);
        if (!day) {
            return res.status(404).json({ message: "Day not found" });
        }
        res.json({ message: "Day deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting day" });
    }
};

module.exports = {
    createDay,
    getDaysByYear,
    getDayById,
    updateDay,
    deleteDay
};