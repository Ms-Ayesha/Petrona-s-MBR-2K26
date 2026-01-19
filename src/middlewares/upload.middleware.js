const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const createUpload = (folder) => {
  return {
    single: () => async (req, res, next) => {
      try {
        await new Promise((resolve, reject) => {
          upload.single("image")(req, res, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        if (!req.file) return next();

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
