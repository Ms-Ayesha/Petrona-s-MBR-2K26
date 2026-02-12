const axios = require("axios");
const fs = require("fs");
const path = require("path");
const transporter = require("../config/mail"); // ✅ IMPORT ONLY

const sendPdfMail = async (to, pdfUrl, stationName) => {
  try {

    const explorationStations = ["station 1", "station 2"];

    const isExploration = explorationStations
      .map(s => s.toLowerCase())
      .includes(stationName.toLowerCase());

    const opportunityType = isExploration
      ? "Exploration Blocks"
      : "DRO";

    const subject = `${opportunityType} Opportunities on Offer | MBR2026`;

    const fileName = isExploration
      ? "Exploration Blocks Factsheet.pdf"
      : "Dro Factsheet.pdf";

    /* DOWNLOAD PDF */
    const pdfResponse = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
    });

    /* TEMPLATE */
    const templatePath = path.join(__dirname, "../Template/pdfMailTemplate.html");
    let html = fs.readFileSync(templatePath, "utf8");
    html = html.replace(/{{opportunityType}}/g, opportunityType);

    /* SEND */
    await transporter.sendMail({
      from: `"Malaysia Bid Round 2026" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments: [
        {
          filename: fileName,
          content: pdfResponse.data,
          contentType: "application/pdf",
        },
      ],
    });

    return { message: "Email sent successfully" };

  } catch (error) {
    throw new Error(`Email failed: ${error.message}`);
  }
};

module.exports = sendPdfMail;
