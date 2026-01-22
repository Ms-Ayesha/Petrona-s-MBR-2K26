const Year = require("../models/year.model");

const createYear = async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }
    try {
        const year = await Year.create({ title });
        res.status(201).json(year);
    } catch (error) {
        res.status(500).json({ message: "Error creating year" });
    }
};

const getAllYears = async (req, res) => {
    try {
        const years = await Year.find().sort({ createdAt: 1 });
        res.json(years);
    } catch (error) {
        res.status(500).json({ message: "Error fetching years" });
    }
};

const getYearById = async (req, res) => {
    const { id } = req.params;
    try {
        const year = await Year.findById(id);
        if (!year) {
            return res.status(404).json({ message: "Year not found" });
        }
        res.json(year);
    } catch (error) {
        res.status(500).json({ message: "Error fetching year" });
    }
};

const updateYear = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
        const year = await Year.findByIdAndUpdate(id, { title }, { new: true });
        if (!year) {
            return res.status(404).json({ message: "Year not found" });
        }
        res.json(year);
    } catch (error) {
        res.status(500).json({ message: "Error updating year" });
    }
};

const deleteYear = async (req, res) => {
    const { id } = req.params;
    try {
        const year = await Year.findByIdAndDelete(id);
        if (!year) {
            return res.status(404).json({ message: "Year not found" });
        }
        res.json({ message: "Year deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting year" });
    }
};

module.exports = {
    createYear,
    getAllYears,
    getYearById,
    updateYear,
    deleteYear
};