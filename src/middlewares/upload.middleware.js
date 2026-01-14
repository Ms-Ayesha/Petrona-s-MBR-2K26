const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const storage = multer.memoryStorage();

/**
 * Dynamic upload middleware for any controller
 * @param {string} folder - Cloudinary folder name
 */
const createUpload = (folder) => {
  const upload = multer({ storage });

  const middleware = async (req, res, next) => {
    upload.single("image")(req, res, async (err) => {
      if (err) return next(err);

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

        // 🔥 Preserve old behavior
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
