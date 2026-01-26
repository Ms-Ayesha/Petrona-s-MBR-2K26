const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Max 50 MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only image and PDF files are allowed!"), false);
    }
  },
});

const createUpload = (folder) => {
  return {
    // Single Image Upload
    single: (fieldName = "image") => async (req, res, next) => {
      try {
        await new Promise((resolve, reject) => {
          upload.single(fieldName)(req, res, (err) => (err ? reject(err) : resolve()));
        });

        if (!req.file) return next();

        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (err, res) => (err ? reject(err) : resolve(res))
          );
          stream.end(req.file.buffer);
        });

        req.file.path = result.secure_url;
        req.file.cloudinaryId = result.public_id;
        next();
      } catch (err) {
        console.error("Single upload middleware error:", err);
        next(err);
      }
    },

    // PDF Upload
    pdf: (fieldName = "pdfUrl") => async (req, res, next) => {
      try {
        await new Promise((resolve, reject) => {
          upload.single(fieldName)(req, res, (err) => (err ? reject(err) : resolve()));
        });

        if (!req.file) return next();

        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "raw", timeout: 60000 },
            (err, res) => (err ? reject(err) : resolve(res))
          );
          stream.end(req.file.buffer);
        });

        req.file.path = result.secure_url;
        req.file.cloudinaryId = result.public_id;
        next();
      } catch (err) {
        console.error("PDF upload middleware error:", err);
        res.status(500).json({
          message: err.message || "PDF upload failed",
          details: err.name,
        });
      }
    },

    // Multiple Images Upload
    array: (fieldName = "images", limit = 10) => async (req, res, next) => {
      try {
        await new Promise((resolve, reject) => {
          upload.array(fieldName, limit)(req, res, (err) => (err ? reject(err) : resolve()));
        });

        if (!req.files || req.files.length === 0) return next();

        const uploadedImages = [];
        for (const file of req.files) {
          const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder, resource_type: "image" },
              (err, res) => (err ? reject(err) : resolve(res))
            );
            stream.end(file.buffer);
          });

          uploadedImages.push({
            path: result.secure_url,
            cloudinaryId: result.public_id,
          });
        }

        req.files = uploadedImages;
        next();
      } catch (err) {
        console.error("Array upload middleware error:", err);
        next(err);
      }
    },
  };
};

module.exports = createUpload;
