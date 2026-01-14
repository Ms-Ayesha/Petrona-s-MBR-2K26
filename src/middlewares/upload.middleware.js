const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Middleware factory for single file upload to Cloudinary
 * @param {string} folder - Cloudinary folder name
 */
const createUpload = (folder) => {
  return {
    single: () => async (req, res, next) => {
      try {
        // Wrap multer single file upload in a Promise
        await new Promise((resolve, reject) => {
          upload.single("image")(req, res, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        // If no file uploaded, skip Cloudinary
        if (!req.file) return next();

        // Upload buffer to Cloudinary
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

        // Set Cloudinary URL for controller
        req.file.path = result.secure_url;

        next();
      } catch (err) {
        console.error("Upload middleware error:", err);
        next(err);
      }
    },
  };
};

module.exports = createUpload;
