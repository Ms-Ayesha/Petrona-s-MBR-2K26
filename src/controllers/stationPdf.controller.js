const StationPdf = require("../models/stationPdf.model");
const cloudinary = require("../config/cloudinary");

/* ===== CREATE OR REPLACE PDF BY STATION NAME ===== */
const createOrUpdatePdf = async (req, res) => {
    try {
        const { stationName } = req.body;

        // Validation
        if (!stationName) return res.status(400).json({ message: "Station name is required" });
        if (!req.file) return res.status(400).json({ message: "PDF file is required" });

        // Check if station already exists
        let station = await StationPdf.findOne({ stationName });

        const uploadResult = {
            secure_url: req.file.path,
            public_id: req.file.cloudinaryId,
        };

        if (station) {
            // Delete old PDF from Cloudinary
            if (station.cloudinaryId) {
                await cloudinary.uploader.destroy(station.cloudinaryId, { resource_type: "raw" });
            }

            // Replace PDF
            station.pdfUrl = uploadResult.secure_url;
            station.cloudinaryId = uploadResult.public_id;
            await station.save();
        } else {
            // Create new station PDF
            station = await StationPdf.create({
                stationName,
                pdfUrl: uploadResult.secure_url,
                cloudinaryId: uploadResult.public_id,
            });
        }

        res.status(200).json({ message: "PDF saved successfully", data: station });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Internal Server error" });
    }
};

/* ===== UPDATE STATION BY ID (Only provided fields + PDF replace) ===== */
const updateStationById = async (req, res) => {
    try {
        const { stationName } = req.body;

        const station = await StationPdf.findById(req.params.id);
        if (!station) return res.status(404).json({ message: "Station not found" });

        // Update only provided fields
        if (stationName) station.stationName = stationName;

        // Replace PDF if new file uploaded
        if (req.file && req.file.path) {
            if (station.cloudinaryId) {
                await cloudinary.uploader.destroy(station.cloudinaryId, { resource_type: "raw" });
            }
            station.pdfUrl = req.file.path;
            station.cloudinaryId = req.file.cloudinaryId;
        }

        await station.save();

        res.status(200).json({ message: "Station updated successfully", data: station });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal Server error" });
    }
};

/* ===== GET ALL STATIONS ===== */
const getAllStations = async (req, res) => {
    try {
        const data = await StationPdf.find().sort({ createdAt: -1 });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal Server error" });
    }
};

/* ===== GET STATION BY ID ===== */
const getStationById = async (req, res) => {
    try {
        const data = await StationPdf.findById(req.params.id);
        if (!data) return res.status(404).json({ message: "Station not found" });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

/* ===== DELETE STATION ===== */
const deleteStation = async (req, res) => {
    try {
        const station = await StationPdf.findById(req.params.id);
        if (!station) return res.status(404).json({ message: "Station not found" });

        // Delete PDF from Cloudinary
        if (station.cloudinaryId) {
            await cloudinary.uploader.destroy(station.cloudinaryId, { resource_type: "raw" });
        }

        // Delete DB record
        await station.deleteOne();

        res.status(200).json({ message: "Station deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

module.exports = {
    createOrUpdatePdf,
    updateStationById,
    getAllStations,
    getStationById,
    deleteStation,
};
