// src/utils/sendEmail.js
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const imagePath = path.join(__dirname, "../public/images/header-img.png");

const sendEmail = async (to, subject, templateName, variables = {}) => {
  const templatePath = path.join(__dirname, "../Template", templateName);
  let html = fs.readFileSync(templatePath, "utf8");

  // Replace variables
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, variables[key]);
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


await transporter.sendMail({
  from: `"MBR Platform" <${process.env.EMAIL_USER}>`,
  to,
  subject,
  html,
  attachments: [
    {
      filename: "header-img.png",
      path: imagePath,
      cid: "headerimg",
    },
  ],
});
};

module.exports = sendEmail;