const nodemailer = require("nodemailer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const sendPdfMail = async (to, pdfUrl, stationName) => {
  try {

    /* ==============================
       STATION BASED CONFIG
    ============================== */

    const explorationStations = ["station 1", "station 2"]; // add more if needed

    const isExploration = explorationStations
      .map(s => s.toLowerCase())
      .includes(stationName.toLowerCase());

    // Subject + body text
    const opportunityType = isExploration
      ? "Exploration Blocks"
      : "DRO";

    const subject = `${opportunityType} Opportunities on Offer | MBR2026`;

    // ✅ NEW → attachment filename logic
    const fileName = isExploration
      ? "Exploration Blocks Factsheet.pdf"
      : "Dro Factsheet.pdf";

    const senderName = "Malaysia Bid Round 2026";
    const senderEmail = "malaysiabidround@gmail.com";


    /* ==============================
       MAIL TRANSPORT
    ============================== */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,   // mail.malaysiabidround.com
  port: process.env.SMTP_PORT,   // 465
  secure: true,                 // TRUE for 465
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
          filename: fileName,   // ✅ changed here (dynamic name)
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
