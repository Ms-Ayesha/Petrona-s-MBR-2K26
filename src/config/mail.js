const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,      // mail.petronasmbr.com
  port: Number(process.env.SMTP_PORT), // 465
  secure: true,                      // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,       // optional, kabhi SSL cert problem ke liye
  },
});

module.exports = transporter;
