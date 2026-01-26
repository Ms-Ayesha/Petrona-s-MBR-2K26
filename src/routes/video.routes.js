const router = require("express").Router();
const {
  createVideo,
  getVideoByDay,
  getVideoById,
  updateVideo,
  deleteVideo
} = require("../controllers/video.controller");

router.post("/", createVideo);
router.get("/day/:dayId", getVideoByDay);
router.get("/:id", getVideoById);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);

module.exports = router;
