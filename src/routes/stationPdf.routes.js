const express = require("express");
const router = express.Router();
const createUpload = require("../middlewares/upload.middleware");
const upload = createUpload("station_pdfs");
const adminMiddleware = require("../middlewares/admin.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const {
  createOrUpdatePdf,
  updateStationById,
  getAllStations,
  getStationById,
  deleteStation,
} = require("../controllers/stationPdf.controller");

router.get("/", authMiddleware, getAllStations);
router.get("/:id", authMiddleware, getStationById);
router.post("/", adminMiddleware, upload.pdf("pdfUrl"), createOrUpdatePdf);
router.put("/:id", adminMiddleware, upload.pdf("pdfUrl"), updateStationById);
router.delete("/:id", adminMiddleware, deleteStation);

module.exports = router;
