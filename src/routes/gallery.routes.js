const express = require("express");
const router = express.Router();
const createUpload = require("../middlewares/upload.middleware");
const upload = createUpload("gallery");

const {
  createGalleryImages,
  updateImage,
  deleteImage,
  getAllImages,
  getImageById,
} = require("../controllers/gallery.controller");

router.get("/", getAllImages);
router.get("/:id", getImageById);
router.post("/", upload.array("images", 20), createGalleryImages); // Max 20 images per request
router.put("/:id", upload.single("image"), updateImage);
router.delete("/:id", deleteImage);

module.exports = router;
