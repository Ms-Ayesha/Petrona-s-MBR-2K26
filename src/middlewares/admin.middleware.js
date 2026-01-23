
const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");
const Admin = require("../models/admin.model");

const adminMiddleware = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized - no token" });
    }

    try {
        const decoded = jwt.verify(token, secret);
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            return res.status(401).json({ message: "Invalid token - admin not found" });
        }

        req.admin = admin;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Token expired or invalid" });
    }
};

module.exports = adminMiddleware;