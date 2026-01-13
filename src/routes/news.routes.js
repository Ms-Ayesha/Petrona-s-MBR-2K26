const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middlewares/admin.middleware");
const { upload, uploadToCloudinary } = require("../middlewares/upload.middleware");
const { createNew, getAllNews, getNewById, updateNew, deleteNew } = require("../controllers/news.controller");

router.get("/", getAllNews);
router.get("/:id", getNewById);

router.post("/", adminMiddleware, upload.single("image"), uploadToCloudinary("news_images"), createNew);
router.put("/:id", adminMiddleware, upload.single("image"), uploadToCloudinary("news_images"), updateNew);
router.delete("/:id", adminMiddleware, deleteNew);

module.exports = router;
