const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middlewares/admin.middleware");
const createUpload = require("../middlewares/upload.middleware");
const upload = createUpload("news_images");
const {
  createNew,
  getAllNews,
  getNewById,
  updateNew,
  deleteNew,
} = require("../controllers/news.controller");

router.get("/", getAllNews);
router.get("/:id", getNewById);

router.post("/", adminMiddleware, upload.single(), createNew);
router.put("/:id", adminMiddleware, upload.single(), updateNew);
router.delete("/:id", adminMiddleware, deleteNew);

module.exports = router;
