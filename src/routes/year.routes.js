const express = require("express");
const router = express.Router();

const {
    createYear,
    getAllYears,
    getYearById,
    updateYear,
    deleteYear
} = require("../controllers/year.controller");

router.get("/", getAllYears);

router.get("/:id", getYearById);

router.post("/", createYear);

router.put("/:id", updateYear);

router.delete("/:id", deleteYear);

module.exports = router;