const mongoose = require("mongoose");

const daySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true // day1, day2
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Day", daySchema);
