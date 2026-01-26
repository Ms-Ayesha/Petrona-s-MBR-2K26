const Contact = require("../models/contact.model");
const cloudinary = require("../config/cloudinary");

/* ===== CREATE CONTACT ===== */
const createContact = async (req, res) => {
    try {
        const { name, designation, description, category } = req.body;

        // Validation
        if (!name || !designation || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }

        const contact = await Contact.create({
            name,
            designation,
            description,
            category,
            image: req.file.path,
            cloudinaryId: req.file.cloudinaryId,
        });

        res.status(201).json({
            success: true,
            message: "Contact created successfully",
            data: contact,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ===== GET ALL CONTACTS (Dynamic Categories) ===== */
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        // Group contacts by category dynamically
        const grouped = {};
        contacts.forEach(contact => {
            if (!grouped[contact.category]) grouped[contact.category] = [];
            grouped[contact.category].push(contact);
        });

        res.status(200).json({
            success: true,
            data: grouped,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ===== GET SINGLE CONTACT ===== */
const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        res.status(200).json({
            success: true,
            data: contact,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ===== UPDATE CONTACT ===== */
const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        // Update only fields provided in req.body dynamically
        Object.keys(req.body).forEach(key => {
            contact[key] = req.body[key];
        });

        // If new image uploaded
        if (req.file) {
            // Delete old image from Cloudinary
            await cloudinary.uploader.destroy(contact.cloudinaryId);

            // Update new image
            contact.image = req.file.path;
            contact.cloudinaryId = req.file.cloudinaryId;
        }

        await contact.save();

        res.status(200).json({
            success: true,
            message: "Contact updated successfully",
            data: contact,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ===== DELETE CONTACT ===== */
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(contact.cloudinaryId);

        // Delete from DB
        await contact.deleteOne();

        res.status(200).json({
            success: true,
            message: "Contact deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact
};
