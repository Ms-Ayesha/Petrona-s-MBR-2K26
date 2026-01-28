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

        if (!req.file)
            return res.status(400).json({ message: "Image file is required" });

        let gallery = await Gallery.findOne({ year, section });
        if (!gallery) {
            gallery = await Gallery.create({ year, section, images: [] });
        }

        // Add the new image
        const newImage = { url: req.file.path, cloudinaryId: req.file.cloudinaryId };
        gallery.images.push(newImage);
        await gallery.save();

        // Respond only with the new image
        res.status(201).json({
            message: "Image uploaded successfully",
            data: {
                _id: gallery._id,
                year: gallery.year,
                section: gallery.section,
                images: [
                    {
                        _id: gallery.images[gallery.images.length - 1]._id,
                        url: newImage.url,
                        cloudinaryId: newImage.cloudinaryId
                    }
                ]
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

// Update a single image
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

        res.json({
            message: "Image updated successfully",
            data: { _id: image._id, url: image.url, cloudinaryId: image.cloudinaryId }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//delete the image on cloudinary or database
async function deleteImage(req, res) {
    try {
        const { id } = req.params;
        const gallery = await Gallery.findOne({ "images._id": id });
        if (!gallery) return res.status(404).json({ message: "Image not found" });

        const image = gallery.images.id(id);

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(image.cloudinaryId);

        gallery.images.pull(id);
        await gallery.save();

        res.json({ message: "Image deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all galleries with images
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

// Get single image by ID
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
    getImageById
};
