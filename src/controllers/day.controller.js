const Day = require("../models/day.model");
const Section = require("../models/section.model");

const createDay = async (req, res) => {
    try {
        const { day, section } = req.body;

        if (!day)
            return res.status(400).json({ message: "Day is required (e.g. day1)" });

        if (!section)
            return res.status(400).json({ message: "Section ID is required" });

        const sectionExists = await Section.findById(section);
        if (!sectionExists)
            return res.status(404).json({ message: "Section not found" });

        const alreadyExists = await Day.findOne({ day, section });
        if (alreadyExists)
            return res.status(400).json({ message: "This day already exists in this section" });

        const newDay = await Day.create({ day, section });

        res.status(201).json({
            message: "Day created successfully",
            data: newDay
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getDaysBySection = async (req, res) => {
    try {
        const { sectionId } = req.params;

        if (!sectionId)
            return res.status(400).json({ message: "Section ID is required" });

        const days = await Day.find({ section: sectionId })
            .sort({ createdAt: 1 });

        res.json({
            count: days.length,
            data: days
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDayById = async (req, res) => {
    try {
        const day = await Day.findById(req.params.id)
            .populate({
                path: "section",
                populate: { path: "year" } // optional but powerful
            });

        if (!day)
            return res.status(404).json({ message: "Day not found" });

        res.json(day);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllDays = async (req, res) => {
    try {
        const days = await Day.find()
            .select("day")  
            .sort({ createdAt: 1 });

        res.json(days); 

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateDay = async (req, res) => {
    try {
        const { day } = req.body;

        if (!day)
            return res.status(400).json({ message: "Day value is required" });

        const updatedDay = await Day.findByIdAndUpdate(
            req.params.id,
            { day },
            { new: true }
        );

        if (!updatedDay)
            return res.status(404).json({ message: "Day not found" });

        res.json({
            message: "Day updated successfully",
            data: updatedDay
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteDay = async (req, res) => {
    try {
        const deletedDay = await Day.findByIdAndDelete(req.params.id);

        if (!deletedDay)
            return res.status(404).json({ message: "Day not found" });

        res.json({ message: "Day deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDay,
    getDaysBySection,
    getDayById,
    updateDay,
    deleteDay,
    getAllDays
};

