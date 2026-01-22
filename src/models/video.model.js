const mongoose = require("mongoose");

const timestampSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    time: {
        type: Number,
        required: true
    }
});

const videoSchema = new mongoose.Schema({

    day: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Day",
        required: true
    },

    url: {
        type: String,
        required: true
    },

    timestamps: [timestampSchema]
},
    {
        timestamps: true
    });

module.exports = mongoose.model("Video", videoSchema);
