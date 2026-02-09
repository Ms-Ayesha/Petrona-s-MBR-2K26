const fs = require("fs");
const path = require("path");
const transporter = require("../config/mail"); // ✅ correct path

const sendEmail = async (to, subject, templateName, variables = {}) => {
  const templatePath = path.join(__dirname, "../Template", templateName);

  let html = fs.readFileSync(templatePath, "utf8");

  Object.keys(variables).forEach((key) => {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), variables[key]);
  });

  await transporter.sendMail({
    from: `"MBR Team" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
