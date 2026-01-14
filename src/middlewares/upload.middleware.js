// middlewares/upload.middleware.js
const multer = require("multer");

const createUpload = () => {
  const storage = multer.memoryStorage(); // store files in memory
  return multer({ storage });
};

module.exports = createUpload;
