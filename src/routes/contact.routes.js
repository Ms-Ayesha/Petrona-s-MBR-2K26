const express = require("express");
const router = express.Router();

const adminMiddleware = require("../middlewares/admin.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const createUpload = require("../middlewares/upload.middleware");

const {
    createContact,
    updateContact,
    deleteContact,
    getContacts,
    getContactById,
} = require("../controllers/contact.controller");


router.get("/", authMiddleware, getContacts);
router.get("/:id", authMiddleware, getContactById);

router.post("/", adminMiddleware, createUpload("contacts").single(), createContact);
router.put("/:id", adminMiddleware, createUpload("contacts").single(), updateContact);
router.delete("/:id", adminMiddleware, deleteContact);


module.exports = router;
