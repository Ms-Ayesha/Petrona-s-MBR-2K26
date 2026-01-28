const router = require("express").Router();
const adminMiddleware = require("../middlewares/admin.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const { createYear, getAllYears, getYearById, updateYear, deleteYear } = require("../controllers/year.controller");

router.get("/", authMiddleware, getAllYears);

router.get("/:id", authMiddleware, getYearById);

router.post("/", adminMiddleware, createYear);

router.put("/:id", adminMiddleware, updateYear);

router.delete("/:id", adminMiddleware, deleteYear);

module.exports = router;
