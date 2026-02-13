const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,   // your mail server
  port: Number(process.env.SMTP_PORT),
  secure: true, // TRUE for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
   logger: true,
  debug: true,
});


module.exports = transporter;
