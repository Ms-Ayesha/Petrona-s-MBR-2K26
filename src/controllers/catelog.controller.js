const Item = require("../models/catelog.model");

const createItem = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!req.file) return res.status(400).json({ message: "Image is required" });

        const image = req.file.path;

        const item = await Item.create({ title, description, image });

        res.status(201).json({ message: "Item created successfully", item });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) updateData.image = req.file.path;

        const updatedItem = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });

        res.status(200).json({ message: "Item updated successfully", updatedItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createItem, updateItem, getItems, getItemById, deleteItem };
