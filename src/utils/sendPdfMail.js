// src/utils/sendPdfMail.js

const transporter = require("../config/mail"); // ✅ use shared transporter
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const sendPdfMail = async (to, pdfUrl, stationName) => {
  try {
    // download pdf
    const pdfResponse = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
    });

    // load html template
    const templatePath = path.join(
      __dirname,
      "../Template/pdfMailTemplate.html"
    );

    let html = fs.readFileSync(templatePath, "utf8");
    html = html.replace(/{{stationName}}/g, stationName);

    // send mail using DOMAIN SMTP (not gmail)
    await transporter.sendMail({
      from: `"Station System" <${process.env.EMAIL_USER}>`,
      to,
      subject: `PDF for ${stationName}`,
      html,
      attachments: [
        {
          filename: `${stationName}.pdf`,
          content: pdfResponse.data,
          contentType: "application/pdf",
        },
      ],
    });

    console.log("✅ PDF Email sent successfully");
    return { message: "Email sent successfully" };
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    throw new Error(`Email failed: ${error.message}`);
  }
};

module.exports = sendPdfMail;
