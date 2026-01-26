const Item = require("../models/catelog.model");
const cloudinary = require("../config/cloudinary");

/* ===== CREATE ITEM ===== */
const createItem = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const item = await Item.create({
            title,
            description,
            image: req.file.path,
            cloudinaryId: req.file.cloudinaryId
        });

        res.status(201).json({
            success: true,
            message: "Item created successfully",
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ===== UPDATE ITEM ===== */
const updateItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        if (req.body.title) item.title = req.body.title;
        if (req.body.description) item.description = req.body.description;

        if (req.file) {
            // Delete old image from Cloudinary
            await cloudinary.uploader.destroy(item.cloudinaryId);

            // Update new image
            item.image = req.file.path;
            item.cloudinaryId = req.file.cloudinaryId;
        }

        await item.save();

        res.status(200).json({
            success: true,
            message: "Item updated successfully",
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ===== GET ALL ITEMS ===== */
const getItems = async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ===== GET SINGLE ITEM ===== */
const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        res.status(200).json({
            success: true,
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ===== DELETE ITEM ===== */
const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(item.cloudinaryId);

        // Delete from DB
        await item.deleteOne();

        res.status(200).json({
            success: true,
            message: "Item deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createItem,
    updateItem,
    getItems,
    getItemById,
    deleteItem
};
