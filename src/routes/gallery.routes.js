const express = require("express");
const router = express.Router();
const createUpload = require("../middlewares/upload.middleware");
const upload = createUpload("gallery");

const {
  createGalleryImages,
  updateImage,
  deleteImage,
  getAllImages,
  getImageById
} = require("../controllers/gallery.controller");

router.get("/", getAllImages);
router.get("/:id", getImageById);

// Upload single image
router.post("/", upload.single("image"), createGalleryImages);

// Update single image
router.put("/:id", upload.single("image"), updateImage);

// Delete single image
router.delete("/:id", deleteImage);

module.exports = router;
