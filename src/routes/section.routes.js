const router = require("express").Router();
const adminMiddleware = require("../middlewares/admin.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const { createSection, getSectionsByYear, getSectionById, updateSection, deleteSection, getAllSections } = require("../controllers/section.controller");

router.get("/:yearId", authMiddleware, getSectionsByYear);

router.get("/id/:id", authMiddleware, getSectionById);

router.get("/", authMiddleware, getAllSections);

router.post("/", adminMiddleware, createSection);

router.put("/:id", adminMiddleware, updateSection);

router.delete("/:id", adminMiddleware, deleteSection);

module.exports = router;
