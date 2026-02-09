const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const sendEmail = async (to, subject, templateName, variables = {}) => {
  // Load HTML template
  const templatePath = path.join(__dirname, "../Template", templateName);
  let html = fs.readFileSync(templatePath, "utf8");

  // Replace variables in template
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, variables[key]);
  });

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,           // petronasmbr.com
    port: 465,  // 465
    secure: true,                          // true for 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send email
  await transporter.sendMail({
    from: `"MBR Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log(`Email sent successfully to ${to}`);
};

module.exports = sendEmail;
