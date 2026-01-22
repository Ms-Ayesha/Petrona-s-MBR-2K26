const mongoose = require("mongoose");

const stationMailSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please enter a valid email address"
            ]
        },

        stationName: {
            type: String,
            required: [true, "Station name is required"],
            trim: true,
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("StationMail", stationMailSchema);
