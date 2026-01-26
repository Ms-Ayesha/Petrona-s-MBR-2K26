const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        designation: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
        cloudinaryId: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
