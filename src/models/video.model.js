const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true
  },
  timestamps: [
    {
      title: String,
      time: Number
    }
  ],
  day: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Day",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Video", videoSchema);
