// src/models/stationPdf.model.js
const mongoose = require("mongoose");

const stationPdfSchema = new mongoose.Schema(
  {
    stationName: { type: String, required: true, trim: true, unique: true },
    pdfUrl: { type: String, required: true },
    cloudinaryId: { type: String, required: true }, // store public ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("StationPdf", stationPdfSchema);
