const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Multer in memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Upload middleware to Cloudinary dynamically
 * @param {string} folder - Cloudinary folder
 */
const uploadToCloudinary = (folder) => {
    return async (req, res, next) => {
        if (!req.file) return next();

        const bufferStream = streamifier.createReadStream(req.file.buffer);

        const streamUpload = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                bufferStream.pipe(stream);
            });
        };

        try {
            const result = await streamUpload();
            req.file.path = result.secure_url; // overwrite path with Cloudinary URL
            next();
        } catch (err) {
            next(err);
        }
    };
};

module.exports = { upload, uploadToCloudinary };
