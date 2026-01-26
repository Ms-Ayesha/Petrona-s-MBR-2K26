// src/middlewares/upload.middleware.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // your Cloudinary config

// Helper to create storage for any folder and resource type
const createStorage = (folder, resource_type = "image") =>
  new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder,
      resource_type, // 'image' for images, 'raw' for PDFs
    },
  });

// Main middleware creator
const createUpload = (folder) => {
  // Image array upload
  const arrayUpload = (fieldName = "images", limit = 10) =>
    multer({ storage: createStorage(folder, "image") }).array(fieldName, limit);

  // Single image upload
  const singleUpload = (fieldName = "image") =>
    multer({ storage: createStorage(folder, "image") }).single(fieldName);

  // Single PDF upload
  const pdfUpload = (fieldName = "pdfUrl") =>
    multer({ storage: createStorage(folder, "raw") }).single(fieldName);

  return {
    single: singleUpload,
    array: arrayUpload,
    pdf: pdfUpload,
  };
};

module.exports = createUpload;
