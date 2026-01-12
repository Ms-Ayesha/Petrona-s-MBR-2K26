const mongoose = require("mongoose");

const newSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true,
            trim: true,
        },
        text1: {
            type: String,
            required: true,
            trim: true,
        },
        text2: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("News", newSchema);
