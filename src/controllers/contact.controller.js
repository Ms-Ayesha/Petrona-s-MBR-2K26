const Contact = require("../models/contact.model");

const createContact = async (req, res) => {
    try {
        const { name, designation, description, category } = req.body;

        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: "Image is required" });
        }

        const contact = await Contact.create({
            name,
            designation,
            description,
            category,
            image: req.file.path,
        });

        res.status(201).json({
            success: true,
            data: contact,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateContact = async (req, res) => {
    try {
        const updates = req.body;

        if (req.file && req.file.path) {
            updates.image = req.file.path;
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.json({
            success: true,
            data: contact,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.json({
            success: true,
            message: "Contact deleted successfully",
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: 1 });

        res.json({
            success: true,
            data: {
                exploration_blocks: contacts.filter(
                    c => c.category === "exploration_blocks"
                ),
                dro_clusters: contacts.filter(
                    c => c.category === "dro_clusters"
                ),
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.json({
            success: true,
            data: contact,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    createContact,
    updateContact,
    deleteContact,
    getContacts,
    getContactById,
};
