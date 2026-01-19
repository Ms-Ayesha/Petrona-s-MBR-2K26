const express = require("express");
const router = express.Router();

const adminMiddleware = require("../middlewares/admin.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const createUpload = require("../middlewares/upload.middleware");

const upload = createUpload("contact_images");

const {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact,
} = require("../controllers/contact.controller");


router.get("/", authMiddleware, getAllContacts);
router.get("/:id", authMiddleware, getContactById);

router.post("/", adminMiddleware, upload.single(), createContact);
router.put("/:id", adminMiddleware, upload.single(), updateContact);
router.delete("/:id", adminMiddleware, deleteContact);

module.exports = router;
