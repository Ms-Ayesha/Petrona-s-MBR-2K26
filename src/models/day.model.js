const mongoose = require("mongoose");

const daySchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    year: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Year",
        required: true
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model("Day", daySchema);
