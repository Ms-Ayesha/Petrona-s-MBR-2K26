const StationPdf = require("../models/stationPdf.model");
const cloudinary = require("../config/cloudinary");

async function createOrUpdatePdf(req, res) {
    try {
        const { stationName } = req.body;
        if (!stationName) return res.status(400).json({ message: "station Name is required" });
        if (!req.file) return res.status(400).json({ message: "PDF file is required" });

        let station = await StationPdf.findOne({ stationName });

        const uploadResult = {
            secure_url: req.file.path,
            public_id: req.file.cloudinaryId,
        };

        if (station) {
            if (station.cloudinaryId) {
                await cloudinary.uploader.destroy(station.cloudinaryId, { resource_type: "raw" });
            }
            station.pdfUrl = uploadResult.secure_url;
            station.cloudinaryId = uploadResult.public_id;
            await station.save();
        } else {
            station = await StationPdf.create({
                stationName,
                pdfUrl: uploadResult.secure_url,
                cloudinaryId: uploadResult.public_id,
            });
        }

        res.status(200).json({ message: "PDF File saved successfully", data: station });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Internal Server error" });
    }
}


async function updateStationById(req, res) {
    try {
        const { stationName } = req.body;

        if (!stationName && (!req.file || !req.file.path))
            return res.status(400).json({ message: "Nothing to update" });

        const station = await StationPdf.findById(req.params.id);

        if (!station) return res.status(404).json({ message: "Station not found" });

        if (stationName) station.stationName = stationName;
        if (req.file && req.file.path) station.pdfUrl = req.file.path;
        await station.save();
        res.status(200).json({ message: "updatedion successfull", data: station });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Internal Server error" });
    }
}

async function getAllStations(req, res) {
    try {
        const data = await StationPdf.find().sort({ createdAt: -1 });
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Internal Server error" });
    }
}

async function getStationById(req, res) {
    try {
        const data = await StationPdf.findById(req.params.id);

        if (!data) return res.status(404).json({ message: "Station not found" });
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
}

async function deleteStation(req, res) {
    try {
        const data = await StationPdf.findByIdAndDelete(req.params.id);

        if (!data) return res.status(404).json({ message: "Station not found" });
        res.status(200).json({ message: "Station deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
}

module.exports = {
    createOrUpdatePdf,
    updateStationById,
    getAllStations,
    getStationById,
    deleteStation,
};
