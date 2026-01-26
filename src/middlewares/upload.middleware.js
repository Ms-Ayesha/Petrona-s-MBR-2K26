const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Multer (no disk, no memory save — sirf stream)
const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
    files: 10,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image & PDF files allowed"), false);
    }
  },
});

const createUpload = (folder) => {
  return {
    // ================= SINGLE IMAGE =================
    singleImage: (fieldName = "image") => [
      upload.single(fieldName),
      async (req, res, next) => {
        try {
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

          req.file = {
            path: result.secure_url,
            cloudinaryId: result.public_id,
          };

          next();
        } catch (err) {
          console.error("Single image upload error:", err);
          res.status(500).json({ message: "Image upload failed" });
        }
      },
    ],

    // ================= MULTIPLE IMAGES =================
    multipleImages: (fieldName = "images", limit = 10) => [
      upload.array(fieldName, limit),
      async (req, res, next) => {
        try {
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
          console.error("Multiple image upload error:", err);
          res.status(500).json({ message: "Images upload failed" });
        }
      },
    ],

    // ================= PDF =================
    pdf: (fieldName = "pdf") => [
      upload.single(fieldName),
      async (req, res, next) => {
        try {
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

          req.file = {
            path: result.secure_url,
            cloudinaryId: result.public_id,
          };

          next();
        } catch (err) {
          console.error("PDF upload error:", err);
          res.status(500).json({ message: "PDF upload failed" });
        }
      },
    ],
  };
};

module.exports = createUpload;
