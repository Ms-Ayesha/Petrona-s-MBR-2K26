const fs = require("fs");
const path = require("path");
const transporter = require("../config/mail"); 

const sendEmail = async (to, subject, templateName, variables = {}) => {
  const templatePath = path.join(__dirname, "../Template", templateName);
  let html = fs.readFileSync(templatePath, "utf8");

  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, variables[key]);
  });

  await transporter.sendMail({
    from: `"Malaysia Bid Round 2026" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
