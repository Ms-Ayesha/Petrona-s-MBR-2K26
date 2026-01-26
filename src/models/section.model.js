const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // video, gallery, future
  },
  year: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Year",
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Section", sectionSchema);
