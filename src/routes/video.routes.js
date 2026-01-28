const router = require("express").Router();
const adminMiddleware = require("../middlewares/admin.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const { createVideo, getVideoByDay, getVideoById, updateVideo, deleteVideo } = require("../controllers/video.controller");

router.get("/:dayId", authMiddleware, getVideoByDay);

router.get("/id/:id", authMiddleware, getVideoById);

router.post("/", adminMiddleware, createVideo);

router.put("/:id", adminMiddleware, updateVideo);

router.delete("/:id", adminMiddleware, deleteVideo);

module.exports = router;
