const Year = require("../models/year.model");

const createYear = async (req, res) => {
    try {
        const { year } = req.body;

        if (!year)
            return res.status(400).json({ message: "Year is required" });

        const exists = await Year.findOne({ year });
        if (exists)
            return res.status(400).json({ message: "Year already exists" });

        const newYear = await Year.create({ year });
        res.status(201).json(newYear);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllYears = async (req, res) => {
    try {
        const years = await Year.find().sort({ year: 1 });
        res.json(years);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getYearById = async (req, res) => {
    try {
        const year = await Year.findById(req.params.id);
        if (!year)
            return res.status(404).json({ message: "Year not found" });

        res.json(year);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateYear = async (req, res) => {
    try {
        const { year } = req.body;

        if (!year)
            return res.status(400).json({ message: "Year is required" });

        const updated = await Year.findByIdAndUpdate(
            req.params.id,
            { year },
            { new: true }
        );

        if (!updated)
            return res.status(404).json({ message: "Year not found" });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteYear = async (req, res) => {
    try {
        const deleted = await Year.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: "Year not found" });

        res.json({ message: "Year deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createYear,
    getAllYears,
    getYearById,
    updateYear,
    deleteYear
};
