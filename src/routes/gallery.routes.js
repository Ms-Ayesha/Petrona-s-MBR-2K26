const express = require("express");
const router = express.Router();

const adminMiddleware = require("../middlewares/admin.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const createUpload = require("../middlewares/upload.middleware");

const upload = createUpload("gallery");

const { createGalleryImages, getAllImages, getImageById, updateImage, deleteImage } = require("../controllers/gallery.controller");

router.get("/", authMiddleware, getAllImages);
router.get("/:id", authMiddleware, getImageById);

router.post("/", adminMiddleware, upload.array("images", 10), createGalleryImages);
router.put("/:id", adminMiddleware, upload.single("image"), updateImage);
router.delete("/:id", deleteImage);

module.exports = router;
