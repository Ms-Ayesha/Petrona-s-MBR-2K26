const Gallery = require("../models/gallery.model");
const Year = require("../models/year.model");
const Section = require("../models/section.model");
const cloudinary = require("../config/cloudinary");

// ================= CREATE =================
exports.createGalleryImages = async (req, res) => {
  try {
    const { year, section } = req.body;

    if (!year || !section)
      return res.status(400).json({ message: "Year & Section required" });

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "Images required" });

    const yearExists = await Year.findById(year);
    if (!yearExists) return res.status(404).json({ message: "Year not found" });

    const sectionExists = await Section.findById(section);
    if (!sectionExists)
      return res.status(404).json({ message: "Section not found" });

    let gallery = await Gallery.findOne({ year, section });
    if (!gallery) {
      gallery = await Gallery.create({ year, section, images: [] });
    }

    gallery.images.push(...req.files);
    await gallery.save();

    res.status(201).json({
      message: "Images uploaded successfully",
      images: req.files,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE =================
exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file)
      return res.status(400).json({ message: "New image required" });

    const gallery = await Gallery.findOne({ "images._id": id });
    if (!gallery)
      return res.status(404).json({ message: "Image not found" });

    const image = gallery.images.id(id);

    // delete old from cloudinary
    await cloudinary.uploader.destroy(image.cloudinaryId);

    image.path = req.file.path;
    image.cloudinaryId = req.file.cloudinaryId;

    await gallery.save();

    res.json({
      message: "Image updated successfully",
      image,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE =================
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findOne({ "images._id": id });
    if (!gallery)
      return res.status(404).json({ message: "Image not found" });

    const image = gallery.images.id(id);

    await cloudinary.uploader.destroy(image.cloudinaryId);

    gallery.images.pull(id);
    await gallery.save();

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ALL =================
exports.getAllImages = async (req, res) => {
  try {
    const galleries = await Gallery.find()
      .populate("year")
      .populate("section")
      .sort({ createdAt: -1 });

    res.json(galleries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET SINGLE IMAGE =================
exports.getImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findOne({ "images._id": id })
      .populate("year", "_id year")
      .populate("section", "_id name");

    if (!gallery)
      return res.status(404).json({ message: "Image not found" });

    const image = gallery.images.id(id);

    res.json({
      ...image.toObject(),
      year: gallery.year,
      section: gallery.section,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
