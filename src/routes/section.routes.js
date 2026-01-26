const router = require("express").Router();
const {
  createSection,
  getSectionsByYear,
  getSectionById,
  updateSection,
  deleteSection
} = require("../controllers/section.controller");

router.post("/", createSection);
router.get("/year/:yearId", getSectionsByYear);
router.get("/:id", getSectionById);
router.put("/:id", updateSection);
router.delete("/:id", deleteSection);

module.exports = router;
