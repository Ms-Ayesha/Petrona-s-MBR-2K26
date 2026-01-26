const express = require("express");
const router = express.Router();

const createUpload = require("../middlewares/upload.middleware");
const {
    createGalleryImages,
    updateImage,
    deleteImage,
    getAllImages,
    getImageById,
} = require("../controllers/gallery.controller");

const upload = createUpload("gallery");

// CREATE – multiple images
router.post(
    "/",
    upload.array("images", 10),
    createGalleryImages
);

// UPDATE single image
router.put(
    "/:id",
    upload.single("image"),
    updateImage
);

// DELETE image
router.delete("/:id", deleteImage);

// GET all galleries
router.get("/", getAllImages);

// GET single image by image id
router.get("/image/:id", getImageById);

module.exports = router;
