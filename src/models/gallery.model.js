const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true
  }
});

const gallerySchema = new mongoose.Schema(
  {
    year: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Year",
      required: true
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true
    },
    images: [imageSchema]
  },
  {
    timestamps: true
  }
);
 
module.exports = mongoose.model("Gallery", gallerySchema);
 