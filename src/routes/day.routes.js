const router = require("express").Router();
const {
  createDay,
  getDays,
  getDayById,
  updateDay,
  deleteDay
} = require("../controllers/day.controller");

router.post("/", createDay);
router.get("/:yearId/:sectionId", getDays);
router.get("/single/:id", getDayById);
router.put("/:id", updateDay);
router.delete("/:id", deleteDay);

module.exports = router;
