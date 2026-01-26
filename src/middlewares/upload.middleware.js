const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// ❌ memoryStorage hata diya (but multer buffer deta rahe ga stream ke liye)
const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image and PDF files are allowed!"), false);
    }
  },
});

const createUpload = (folder) => {
  return {
    // ================= SINGLE IMAGE (same name) =================
    single: (fieldName = "image") => async (req, res, next) => {
      try {
        await new Promise((resolve, reject) => {
          upload.single(fieldName)(req, res, (err) =>
            err ? reject(err) : resolve()
          );
        });

        if (!req.file) return next();

        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type: "image",
              timeout: 120000,
            },
            (err, result) => (err ? reject(err) : resolve(result))
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

        req.file.path = result.secure_url;
        req.file.cloudinaryId = result.public_id;

        delete req.file.buffer; // 🟢 free memory
        next();
      } catch (err) {
        console.error("Single upload error:", err);
        res.status(500).json({ message: "Image upload failed" });
      }
    },

    // ================= PDF (same name) =================
    pdf: (fieldName = "pdfUrl") => async (req, res, next) => {
      try {
        await new Promise((resolve, reject) => {
          upload.single(fieldName)(req, res, (err) =>
            err ? reject(err) : resolve()
          );
        });

        if (!req.file) return next();

        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type: "raw",
              timeout: 180000,
            },
            (err, result) => (err ? reject(err) : resolve(result))
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

        req.file.path = result.secure_url;
        req.file.cloudinaryId = result.public_id;

        delete req.file.buffer;
        next();
      } catch (err) {
        console.error("PDF upload error:", err);
        res.status(500).json({ message: "PDF upload failed" });
      }
    },

    // ================= MULTIPLE IMAGES (same name) =================
    array: (fieldName = "images", limit = 10) => async (req, res, next) => {
      try {
        await new Promise((resolve, reject) => {
          upload.array(fieldName, limit)(req, res, (err) =>
            err ? reject(err) : resolve()
          );
        });

        if (!req.files || req.files.length === 0) return next();

        const uploads = req.files.map(
          (file) =>
            new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                {
                  folder,
                  resource_type: "image",
                  timeout: 120000,
                },
                (err, result) =>
                  err
                    ? reject(err)
                    : resolve({
                        path: result.secure_url,
                        cloudinaryId: result.public_id,
                      })
              );

              streamifier.createReadStream(file.buffer).pipe(stream);
            })
        );

        req.files = await Promise.all(uploads);
        next();
      } catch (err) {
        console.error("Array upload error:", err);
        res.status(500).json({ message: "Images upload failed" });
      }
    },
  };
};

module.exports = createUpload;
