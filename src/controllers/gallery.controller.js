const Gallery = require("../models/gallery.model");
const Section = require("../models/section.model");
const cloudinary = require("../config/cloudinary");

// CREATE / UPLOAD IMAGE
async function createGalleryImages(req, res) {
    try {
        const { section } = req.body;

        if (!section)
            return res.status(400).json({ message: "Section ID is required" });

        // section check + year auto fetch
        const sectionExists = await Section.findById(section).populate("year");
        if (!sectionExists)
            return res.status(404).json({ message: "Section not found" });

        const year = sectionExists.year; // 👈 auto year

        if (!req.file)
            return res.status(400).json({ message: "Image file is required" });

        let gallery = await Gallery.findOne({ section });

        if (!gallery) {
            gallery = await Gallery.create({
                year,
                section,
                images: []
            });
        }

        const newImage = {
            url: req.file.path,
            cloudinaryId: req.file.cloudinaryId
        };

        gallery.images.push(newImage);
        await gallery.save();

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
        res.status(500).json({ message: error.message });
    }
}

// UPDATE IMAGE
async function updateImage(req, res) {
    try {
        const { id } = req.params;

        if (!req.file)
            return res.status(400).json({ message: "New image file is required" });

        const gallery = await Gallery.findOne({ "images._id": id });
        if (!gallery)
            return res.status(404).json({ message: "Image not found" });

        const image = gallery.images.id(id);

        await cloudinary.uploader.destroy(image.cloudinaryId);

        image.url = req.file.path;
        image.cloudinaryId = req.file.cloudinaryId;

        await gallery.save();

        res.json({
            message: "Image updated successfully",
            data: {
                _id: image._id,
                url: image.url,
                cloudinaryId: image.cloudinaryId
            }
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

// GET ALL IMAGES
async function getAllImages(req, res) {
    try {
        const galleries = await Gallery.find()
            .populate("year", "_id year")
            .populate("section", "_id name")
            .sort({ createdAt: -1 });

        res.json(galleries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// GET SINGLE IMAGE BY ID
async function getImageById(req, res) {
    try {
        const { id } = req.params;

        const gallery = await Gallery.findOne({ "images._id": id })
            .populate("year", "_id year")
            .populate("section", "_id name");

        if (!gallery)
            return res.status(404).json({ message: "Image not found" });

        const image = gallery.images.id(id);

        res.json({
            _id: image._id,
            url: image.url,
            cloudinaryId: image.cloudinaryId,
            year: gallery.year,
            section: gallery.section
        });

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
