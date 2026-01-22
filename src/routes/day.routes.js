const express = require("express");
const router = express.Router();

const {
  createDay,
  getDaysByYear,
  getDayById,
  updateDay,
  deleteDay
} = require("../controllers/day.controller");

router.get("/:yearId", getDaysByYear);

router.get("/single/:id", getDayById);

router.post("/:yearId", createDay);

router.put("/:id", updateDay);

router.delete("/:id", deleteDay);

module.exports = router;
