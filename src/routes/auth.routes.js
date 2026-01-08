// src/routes/auth.routes.js
const router = require("express").Router();
const {
  signup,
  activateAccount,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

router.post("/signup", signup);
router.get("/activate/:token", activateAccount);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;