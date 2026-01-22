const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middlewares/admin.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const { sendPdfOnEmail, updateMailById, getAllMails, getMailById, deleteMail } = require("../controllers/stationMail.controller");


router.get("/", authMiddleware, getAllMails);

router.get("/:id", authMiddleware, getMailById);

router.post("/", adminMiddleware, sendPdfOnEmail);

router.put("/:id", adminMiddleware, updateMailById);

router.delete("/:id", adminMiddleware, deleteMail);

module.exports = router;
