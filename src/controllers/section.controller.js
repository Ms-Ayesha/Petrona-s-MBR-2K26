const Section = require("../models/section.model");

const createSection = async (req, res) => {
    try {
        const { name, year } = req.body;

        if (!name || !year)
            return res.status(400).json({ message: "Name and year are required" });

        const section = await Section.create({ name, year });
        res.status(201).json(section);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSectionsByYear = async (req, res) => {
    try {
        const sections = await Section.find({
            year: req.params.yearId,
            isActive: true
        });

        res.json(sections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getAllSections = async (req, res) => {
    try {
        const sections = await Section.find().populate("year").sort({ createdAt: 1 });
        res.json(sections);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
const getSectionById = async (req, res) => {
    try {
        const section = await Section.findById(req.params.id);
        if (!section)
            return res.status(404).json({ message: "Section not found" });

        res.json(section);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSection = async (req, res) => {
    try {
        const updated = await Section.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated)
            return res.status(404).json({ message: "Section not found" });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSection = async (req, res) => {
    try {
        const deleted = await Section.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: "Section not found" });

        res.json({ message: "Section deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSection,
    getSectionsByYear,
    getSectionById,
    updateSection,
    deleteSection,
    getAllSections
};
