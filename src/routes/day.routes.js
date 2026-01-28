const router = require("express").Router();
const adminMiddleware = require("../middlewares/admin.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const { createDay, getDaysBySection, getDayById, updateDay, deleteDay, getAllDays } = require("../controllers/day.controller");

router.get("/:sectionId", authMiddleware, getDaysBySection);

router.get("/id/:id", authMiddleware, getDayById);

router.post("/", adminMiddleware, createDay);

router.get("/", authMiddleware, getAllDays);

router.put("/:id", adminMiddleware, updateDay);

router.delete("/:id", adminMiddleware, deleteDay);

module.exports = router;
