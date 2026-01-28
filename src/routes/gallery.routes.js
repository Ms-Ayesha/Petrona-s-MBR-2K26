const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middlewares/admin.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const createUpload = require("../middlewares/upload.middleware");
const upload = createUpload("gallery");

const { createGalleryImages, updateImage, deleteImage, getAllImages, getImageById } = require("../controllers/gallery.controller");

router.get("/", authMiddleware, getAllImages);

router.get("/:id", authMiddleware, getImageById);

router.post("/", adminMiddleware, upload.single("image"), createGalleryImages);

router.put("/:id", adminMiddleware, upload.single("image"), updateImage);

router.delete("/:id", adminMiddleware, deleteImage);

module.exports = router;
