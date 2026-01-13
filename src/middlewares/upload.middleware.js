const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

/**
 * Dynamic upload middleware for any controller
 * @param {string} folder - Cloudinary folder name
 */
const createUpload = (folder) => {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: folder,
            allowed_formats: ["jpg", "jpeg", "png"],
        },
    });

    return multer({ storage });
};

module.exports = createUpload;
