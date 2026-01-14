const multer = require("multer");
const cloudinary = require("../config/cloudinary"); // Import configured Cloudinary

// Use memory storage to keep files in RAM before uploading
const storage = multer.memoryStorage();

/**
 * Dynamic upload middleware for any controller
 * @param {string} folder - Cloudinary folder name
 */
const createUpload = (folder) => {
  const upload = multer({ storage });

  // Middleware function compatible with Express & Vercel serverless
  const middleware = async (req, res, next) => {
    upload.single("image")(req, res, async (err) => {
      if (err) return next(err);

      if (!req.file) return next(); // No file uploaded

      try {
        // Upload file buffer to Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder }, // folder name in Cloudinary
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(req.file.buffer);
        });

        // Preserve old behavior: req.file.path contains the Cloudinary URL
        req.file.path = result.secure_url;

        next();
      } catch (error) {
        next(error);
      }
    });
  };

  return {
    single: () => middleware,
  };
};

module.exports = createUpload;
