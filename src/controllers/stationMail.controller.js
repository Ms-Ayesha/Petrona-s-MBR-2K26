const StationMail = require("../models/stationMail.model");
const StationPdf = require("../models/stationPdf.model");
const sendPdfMail = require("../utils/sendPdfMail");

async function sendPdfOnEmail(req, res) {
  try {
    const { email, stationName } = req.body;
    if (!email || !stationName) return res.status(400).json({ message: "email and station Name required" });

    const station = await StationPdf.findOne({ stationName });
    if (!station) return res.status(404).json({ message: "No PDF found for this station" });

    await sendPdfMail(email, station.pdfUrl, stationName);

    const mailRecord = await StationMail.findOneAndUpdate(
      { email, stationName },
      { email, stationName },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "PDF sent successfully", data: mailRecord });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server error" });
  }
}

async function updateMailById(req, res) {
    try {
        const { email, stationName } = req.body;
        if (!email && !stationName) return res.status(400).json({ message: "Nothing to update" });

        const mail = await StationMail.findById(req.params.id);
        if (!mail) return res.status(404).json({ message: "Mail record not found" });

        if (email) mail.email = email;
        if (stationName) mail.stationName = stationName;
        await mail.save();

        res.status(200).json({ message: "Mail record updated successfully", data: mail });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
}

async function getAllMails(req, res) {
    try {
        const data = await StationMail.find().sort({ createdAt: -1 });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
}

async function getMailById(req, res) {
    try {
        const data = await StationMail.findById(req.params.id);
        if (!data) return res.status(404).json({ message: "Mail record not found" });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal Server error" });
    }
}

async function deleteMail(req, res) {
    try {
        const data = await StationMail.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ message: "Mail record not found" });
        res.status(200).json({ message: "Mail record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || " Internal Server error" });
    }
}

module.exports = {
    sendPdfOnEmail,
    updateMailById,
    getAllMails,
    getMailById,
    deleteMail
};
