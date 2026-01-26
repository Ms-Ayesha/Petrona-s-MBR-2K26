const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const createUpload = (folder) => {
  return {
    single: (fieldName = "image") => async (req, res, next) => {
      try {
        await new Promise((resolve, reject) => {
          upload.single(fieldName)(req, res, (err) => (err ? reject(err) : resolve()));
        });

        if (!req.file) return next();

        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (error, result) => (error ? reject(error) : resolve(result))
          );
          stream.end(req.file.buffer);
        });

        req.file.path = result.secure_url;
        req.file.cloudinaryId = result.public_id;
        next();
      } catch (err) {
        console.error("Upload middleware error:", err);
        next(err);
      }
    },

    pdf: (fieldName = "pdfUrl") => async (req, res, next) => {
      try {
        await new Promise((resolve, reject) => {
          upload.single(fieldName)(req, res, (err) => (err ? reject(err) : resolve()));
        });

        if (!req.file) return next();

        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "raw", timeout: 60000 },
            (error, result) => (error ? reject(error) : resolve(result))
          );
          stream.end(req.file.buffer);
        });

        req.file.path = result.secure_url;
        req.file.cloudinaryId = result.public_id;
        next();
      } catch (err) {
        console.error("PDF Upload middleware error:", err);
        res.status(500).json({
          message: err.message || "PDF upload failed",
          details: err.name
        });
      }
    },

   
    array: (fieldName = "images", limit = 10) => async (req, res, next) => {
      try {
        await new Promise((resolve, reject) => {
          upload.array(fieldName, limit)(req, res, (err) =>
            err ? reject(err) : resolve()
          );
        });

        if (!req.files || req.files.length === 0) return next();

        const uploadedImages = [];

        for (const file of req.files) {
          const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder, resource_type: "image" },
              (error, result) => (error ? reject(error) : resolve(result))
            );
            stream.end(file.buffer);
          });

          uploadedImages.push({
            path: result.secure_url,
            cloudinaryId: result.public_id
          });
        }

        req.files = uploadedImages;
        next();
      } catch (error) {
        next(error);
      }
    }

  };
};

module.exports = createUpload;
