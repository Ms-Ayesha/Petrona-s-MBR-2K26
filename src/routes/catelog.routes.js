const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middlewares/admin.middleware");
const { upload, uploadToCloudinary } = require("../middlewares/upload.middleware");

const { getItems, getItemById, createItem, updateItem, deleteItem } = require("../controllers/catelog.controller");

router.get("/", getItems);
router.get("/:id", getItemById);

router.post("/", adminMiddleware, upload.single("image"), uploadToCloudinary("catalog_items"), createItem);
router.put("/:id", adminMiddleware, upload.single("image"), uploadToCloudinary("catalog_items"), updateItem);
router.delete("/:id", adminMiddleware, deleteItem);

module.exports = router;
