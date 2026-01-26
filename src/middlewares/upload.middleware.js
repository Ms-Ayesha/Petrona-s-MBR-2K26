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
    // Multiple Images Upload – with retry + better timeout
    array: (fieldName = "images", limit = 10) => async (req, res, next) => {
      try {
        // Multer se files le lo
        await new Promise((resolve, reject) => {
          upload.array(fieldName, limit)(req, res, (err) => (err ? reject(err) : resolve()));
        });

        if (!req.files || req.files.length === 0) return next();

        const uploadedImages = [];

        for (const file of req.files) {
          let result = null;
          let attempts = 0;
          const maxAttempts = 3;           // 3 baar try karega
          const baseDelay = 1500;          // 1.5 second wait

          while (attempts < maxAttempts && !result) {
            try {
              result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  {
                    folder,
                    resource_type: "image",
                    timeout: 180000,           // 3 minutes – bohot zaroori large files ke liye
                  },
                  (err, res) => (err ? reject(err) : resolve(res))
                );
                stream.end(file.buffer);
              });
            } catch (err) {
              attempts++;

              const isRetryable =
                err?.http_code === 503 ||
                err?.message?.toLowerCase().includes("timeout") ||
                err?.message?.includes("503") ||
                err?.name === "TimeoutError";

              if (!isRetryable || attempts >= maxAttempts) {
                console.error(`Upload failed for ${file.originalname} after ${attempts} attempts:`, err);
                throw err; // final fail
              }

              console.warn(
                `Cloudinary retry ${attempts}/${maxAttempts} for ${file.originalname} - ${err.message || "unknown error"}`
              );

              // Exponential backoff
              await new Promise((r) => setTimeout(r, baseDelay * attempts));
            }
          }

          if (!result) {
            throw new Error(`Failed to upload ${file.originalname} after ${maxAttempts} attempts`);
          }

          uploadedImages.push({
            path: result.secure_url,
            cloudinaryId: result.public_id,
          });
        }

        // Replace original req.files with cloudinary response
        req.files = uploadedImages;
        next();
      } catch (err) {
        console.error("Array upload middleware error:", err);
        // Agar multer limit cross hua to 413 bhej sakte ho
        if (err.message?.includes("File too large")) {
          return res.status(413).json({ message: "File too large (max 50MB per image)" });
        }
        next(err); // ya directly res.status(500).json bhej sakte ho yahan
      }
    },
  };
};

module.exports = createUpload;
