// src/utils/sendEmail.js
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const sendEmail = async (to, subject, templateName, variables = {}) => {
  // Load the HTML template
  const templatePath = path.join(__dirname, "../Template", templateName);
  let html = fs.readFileSync(templatePath, "utf8");

  // Replace variables in template
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, variables[key]);
  });

  // SMTP transporter (like sendPdfMail)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,      // SMTP host
    port: process.env.SMTP_PORT,      // SMTP port
    secure: true,                      // true for port 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send the email
  await transporter.sendMail({
    from: `"MBR Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("Email sent successfully via SMTP");
};

module.exports = sendEmail;
