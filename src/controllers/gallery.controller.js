const Gallery = require("../models/gallery.model");
const Year = require("../models/year.model");
const Section = require("../models/section.model");
const cloudinary = require("../config/cloudinary");

async function createGalleryImages(req, res) {
    try {
        const { year, section } = req.body;

        if (!year || !section)
            return res.status(400).json({ message: "Year and Section IDs are required" });

        const yearExists = await Year.findById(year);
        if (!yearExists) return res.status(404).json({ message: "Year not found" });

        const sectionExists = await Section.findById(section);
        if (!sectionExists) return res.status(404).json({ message: "Section not found" });

        if (!req.files || req.files.length === 0)
            return res.status(400).json({ message: "At least one image is required" });

        let gallery = await Gallery.findOne({ year, section });

        const newImages = req.files.map((file) => ({
            url: file.path,
            cloudinaryId: file.cloudinaryId
        }));

        if (gallery) {
            gallery.images.push(...newImages);
            await gallery.save();
        } else {
            gallery = await Gallery.create({ year, section, images: newImages });
        }

        // 🔹 Only return the newly uploaded images
        res.status(201).json({ message: "Images uploaded successfully", data: newImages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


/* ===== GET ALL IMAGES ===== */
async function getAllImages(req, res) {
    try {
        const galleries = await Gallery.find()
            .populate("year")
            .populate("section")
            .sort({ createdAt: -1 });
        res.json(galleries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/* ===== GET SINGLE IMAGE BY IMAGE ID ===== */
async function getImageById(req, res) {
    try {
        const { id } = req.params; // This is image subdocument ID
        const gallery = await Gallery.findOne({ "images._id": id }).populate("year", "_id year")
            .populate("section", "_id name");
        if (!gallery) return res.status(404).json({ message: "Image not found" });

        const image = gallery.images.id(id);
        res.json({ ...image.toObject(), year: gallery.year, section: gallery.section });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateImage(req, res) {
    try {
        const { id } = req.params;
        if (!req.file) return res.status(400).json({ message: "New image file is required" });

        const gallery = await Gallery.findOne({ "images._id": id });
        if (!gallery) return res.status(404).json({ message: "Image not found" });

        const image = gallery.images.id(id);

        await cloudinary.uploader.destroy(image.cloudinaryId);

        image.url = req.file.path;
        image.cloudinaryId = req.file.cloudinaryId;

        await gallery.save();

        res.json({ message: "Image updated successfully", data: image });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteImage(req, res) {
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
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createGalleryImages,
    getAllImages,
    getImageById,
    updateImage,
    deleteImage
};
