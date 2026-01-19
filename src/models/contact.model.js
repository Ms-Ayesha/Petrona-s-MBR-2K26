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
        },

        description: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            enum: ["exploration_blocks", "dro_clusters"],
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
