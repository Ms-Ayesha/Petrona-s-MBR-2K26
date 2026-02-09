const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "malaysiabidround.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,  // false for 587 (STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  logger: true,   // ← shows full SMTP conversation in console
  debug: true,
});

// Verify on startup (add this)
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP verify failed:", error);
  } else {
    console.log("SMTP connection are OK");
  }
});

module.exports = transporter;