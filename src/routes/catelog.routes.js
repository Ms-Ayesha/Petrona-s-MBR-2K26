const express = require("express");
const router = express.Router();

const adminMiddleware = require("../middlewares/admin.middleware");
const createUpload = require("../middlewares/upload.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const upload = createUpload("catalog_items");

const { getItems, getItemById, createItem, updateItem, deleteItem } = require("../controllers/catelog.controller");

router.get("/", authMiddleware, getItems);
router.get("/:id", authMiddleware, getItemById);

router.post("/", adminMiddleware, upload.single("image"), createItem);
router.put("/:id", adminMiddleware, upload.single("image"), updateItem);
router.delete("/:id", adminMiddleware, deleteItem);

module.exports = router;