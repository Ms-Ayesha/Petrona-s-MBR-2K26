// src/config/mail.js

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,   // malaysiabidround.com
  port: 465,
  secure: true,                 // SSL for 465
  auth: {
    user: process.env.EMAIL_USER, // info@malaysiabidround.com
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
