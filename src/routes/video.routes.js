const express = require("express");
const router = express.Router();

const {
    createVideo,
    getVideoByDay,
    getVideoById,
    updateVideo,
    deleteVideo
} = require("../controllers/video.controller");

router.get("/:dayId", getVideoByDay);

router.get("/single/:id", getVideoById);

router.post("/:dayId", createVideo);

router.put("/:id", updateVideo);

router.delete("/:id", deleteVideo);

module.exports = router;