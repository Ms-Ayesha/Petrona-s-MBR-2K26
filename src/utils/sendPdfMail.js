const nodemailer = require("nodemailer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const sendPdfMail = async (to, pdfUrl, stationName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const pdfResponse = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
    });

    const templatePath = path.join(__dirname, "../Template/pdfMailTemplate.html");
    let html = fs.readFileSync(templatePath, "utf8");
    html = html.replace(/{{stationName}}/g, stationName);

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

    console.log("Email sent successfully");
    return { message: "Email sent successfully" };
  } catch (error) {
    console.error(" Email send error:", error.message);
    throw new Error(`Email failed: ${error.message}`);
  }
};

module.exports = sendPdfMail;
