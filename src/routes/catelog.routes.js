const express = require("express");
const router = express.Router();
const itemController = require("../controllers/catelog.controller");
const adminMiddleware = require("../middlewares/admin.middleware");

router.get("/", itemController.getItems);
router.get("/:id", itemController.getItemById);

router.post("/", adminMiddleware, itemController.createItem);
router.put("/:id", adminMiddleware, itemController.updateItem);
router.delete("/:id", adminMiddleware, itemController.deleteItem);

module.exports = router;
