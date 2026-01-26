const Gallery = require("../models/gallery.model");
const Year = require("../models/year.model");
const Section = require("../models/section.model");
const cloudinary = require("../config/cloudinary");

// CREATE / UPLOAD GALLERY IMAGES
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
        if (!gallery) {
            gallery = await Gallery.create({ year, section, images: [] });
        }

        // Save uploaded images
        const newImages = [];
        for (const file of req.files) {
            const newImage = { url: file.path, cloudinaryId: file.cloudinaryId };
            gallery.images.push(newImage);
            newImages.push(newImage);
        }

        await gallery.save();

        // Map only newly uploaded images with their DB _id
        const responseImages = gallery.images
            .slice(-req.files.length)
            .map((img) => ({ _id: img._id, url: img.url, cloudinaryId: img.cloudinaryId }));

        res.status(201).json({
            message: "Images uploaded successfully",
            data: {
                _id: gallery._id,
                year: gallery.year,
                section: gallery.section,
                images: responseImages,
            },
        });
    } catch (error) {
        console.error("Gallery creation error:", error);
        let status = 500;
        let message = "Image upload failed";

        if (error.message?.includes("503") || error.http_code === 503) {
            status = 503;
            message = "Upload service temporarily down (Cloudinary). Please try again in 1-2 minutes.";
        } else if (error.message?.includes("timeout")) {
            message = "Upload timed out – file might be too large or connection slow.";
        } else if (error.message?.includes("File too large")) {
            status = 413;
            message = "Each image max 50MB allowed.";
        }

        return res.status(status).json({ message, error: error.message });
    }
}

// UPDATE IMAGE
async function updateImage(req, res) {
    try {
        const { id } = req.params;
        if (!req.file) return res.status(400).json({ message: "New image file is required" });

        const gallery = await Gallery.findOne({ "images._id": id });
        if (!gallery) return res.status(404).json({ message: "Image not found" });

        const image = gallery.images.id(id);

        // Delete old image from Cloudinary
        await cloudinary.uploader.destroy(image.cloudinaryId);

        image.url = req.file.path;
        image.cloudinaryId = req.file.cloudinaryId;

        await gallery.save();

        res.json({
            message: "Image updated successfully",
            data: { _id: image._id, url: image.url, cloudinaryId: image.cloudinaryId },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// DELETE IMAGE
async function deleteImage(req, res) {
    try {
        const { id } = req.params;
        const gallery = await Gallery.findOne({ "images._id": id });
        if (!gallery) return res.status(404).json({ message: "Image not found" });

        const image = gallery.images.id(id);

        await cloudinary.uploader.destroy(image.cloudinaryId);

        gallery.images.pull(id);
        await gallery.save();

        res.json({ message: "Image deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// GET ALL GALLERY
async function getAllImages(req, res) {
    try {
        const galleries = await Gallery.find().populate("year").populate("section").sort({ createdAt: -1 });
        res.json(galleries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// GET SINGLE IMAGE BY IMAGE ID
async function getImageById(req, res) {
    try {
        const { id } = req.params;
        const gallery = await Gallery.findOne({ "images._id": id })
            .populate("year", "_id year")
            .populate("section", "_id name");
        if (!gallery) return res.status(404).json({ message: "Image not found" });

        const image = gallery.images.id(id);
        res.json({ ...image.toObject(), year: gallery.year, section: gallery.section });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createGalleryImages,
    updateImage,
    deleteImage,
    getAllImages,
    getImageById,
};
