const Day = require("../models/day.model");

const createDay = async (req, res) => {
    try {
        const { day, year, section } = req.body;

        if (!day || !year || !section)
            return res.status(400).json({ message: "Day, year and section are required" });

        const newDay = await Day.create({ day, year, section });
        res.status(201).json(newDay);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDays = async (req, res) => {
    try {
        const { yearId, sectionId } = req.params;

        const days = await Day.find({
            year: yearId,
            section: sectionId
        });

        res.json(days);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDayById = async (req, res) => {
    try {
        const day = await Day.findById(req.params.id);
        if (!day)
            return res.status(404).json({ message: "Day not found" });

        res.json(day);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDay = async (req, res) => {
    try {
        const updated = await Day.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated)
            return res.status(404).json({ message: "Day not found" });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteDay = async (req, res) => {
    try {
        const deleted = await Day.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: "Day not found" });

        res.json({ message: "Day deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDay,
    getDays,
    getDayById,
    updateDay,
    deleteDay
};
