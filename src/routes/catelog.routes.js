const express = require("express");
const router = express.Router();

const {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
} = require("../controllers/catelog.controller");

const adminMiddleware = require("../middlewares/admin.middleware");

router.get("/", getItems);
router.get("/:id", getItemById);

router.post("/", adminMiddleware, createItem);
router.put("/:id", adminMiddleware, updateItem);
router.delete("/:id", adminMiddleware, deleteItem);

module.exports = router;
