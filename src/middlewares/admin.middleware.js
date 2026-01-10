const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");
const Admin = require("../models/admin.model");

const adminMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, secret);
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.admin = admin;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = adminMiddleware;
