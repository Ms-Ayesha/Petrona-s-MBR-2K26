const nodemailer = require("nodemailer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const sendPdfMail = async (to, pdfUrl, stationName) => {
  try {

    /* ==============================
       STATION BASED CONFIG
    ============================== */

    const explorationStations = ["station 1", "station 2"]; // case insensitive

    const isExploration = explorationStations
      .map(s => s.toLowerCase())
      .includes(stationName.toLowerCase());

    const opportunityType = isExploration
      ? "Exploration Blocks"
      : "DRO";

    const subject = `${opportunityType} Opportunities on Offer | MBR2026`;

    const senderName = "Malaysia Bid Round 2026";
    const senderEmail = "malaysiabidround@gmail.com";


    /* ==============================
       MAIL TRANSPORT
    ============================== */

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    /* ==============================
       DOWNLOAD PDF
    ============================== */

    const pdfResponse = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
    });

    /* ==============================
       HTML TEMPLATE
    ============================== */

    const templatePath = path.join(__dirname, "../Template/pdfMailTemplate.html");
    let html = fs.readFileSync(templatePath, "utf8");

    html = html.replace(/{{opportunityType}}/g, opportunityType);

    /* ==============================
       SEND MAIL
    ============================== */

    await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to,
      subject,
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
    console.error("Email send error:", error.message);
    throw new Error(`Email failed: ${error.message}`);
  }
};

module.exports = sendPdfMail;
