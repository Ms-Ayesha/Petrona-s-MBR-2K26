const express = require("express");
const router = express.Router();
const { createNew, getAllNews, getNewById, updateNew, deleteNew, } = require("../controllers/news.controller");

const adminMiddleware = require("../middlewares/admin.middleware");

router.get("/", getAllNews);
router.get("/:id", getNewById);

router.post("/", adminMiddleware, createNew);
router.put("/:id", adminMiddleware, updateNew);
router.delete("/:id", adminMiddleware, deleteNew);

module.exports = router;
