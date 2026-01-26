const router = require("express").Router();
const {
  createYear,
  getAllYears,
  getYearById,
  updateYear,
  deleteYear
} = require("../controllers/year.controller");

router.post("/", createYear);
router.get("/", getAllYears);
router.get("/:id", getYearById);
router.put("/:id", updateYear);
router.delete("/:id", deleteYear);

module.exports = router;
