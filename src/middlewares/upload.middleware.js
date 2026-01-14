const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const storage = multer.memoryStorage();

/**
 * Dynamic upload middleware for any controller
 * @param {string} folder - Cloudinary folder name
 */
const createUpload = (folder) => {
  const upload = multer({ storage });

  return {
    single: (field) => [
      upload.single(field),
      async (req, res, next) => {
        if (!req.file) return next();

        try {
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { folder },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            ).end(req.file.buffer);
          });

          // 🔥 THIS LINE PRESERVES YOUR FUNCTIONALITY
          req.file.path = result.secure_url;

          next();
        } catch (err) {
          next(err);
        }
      },
    ],
  };
};

module.exports = createUpload;
