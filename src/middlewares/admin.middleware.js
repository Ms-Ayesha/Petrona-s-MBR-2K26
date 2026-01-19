
const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");
const Admin = require("../models/admin.model");

const adminMiddleware = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("Received Authorization header:", authHeader);

    const token = authHeader?.replace("Bearer ", "");
    console.log("Extracted token (first 20 chars):", token?.substring(0, 20));

    if (!token) {
        return res.status(401).json({ message: "Unauthorized - no token" });
    }

    try {
        const decoded = jwt.verify(token, secret);
        console.log("Decoded token payload:", decoded);

        const admin = await Admin.findById(decoded.id);
        console.log("Found admin:", admin ? admin.email : "NOT FOUND");

        if (!admin) {
            return res.status(401).json({ message: "Invalid token - admin not found" });
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.log("JWT verification error:", error.name, error.message);
        return res.status(401).json({ message: "Token expired or invalid" });
    }
};

module.exports = adminMiddleware;