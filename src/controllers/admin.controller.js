const bcrypt = require("bcrypt");
const Admin = require("../models/admin.model");
const generateToken = require("../utils/generateToken");

const createAdmin = async (req, res) => {
    try {
        const adminExists = await Admin.findOne();
        if (adminExists) {
            return res.status(400).json({
                message: "Admin already exists",
            });
        }
        await Admin.create(req.body);
        res.status(201).json({
            message: "Admin created successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({
                message: "Invalid email",
            });
        }
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password",
            });
        }
        const token = generateToken({
            id: admin._id,
        });
        res.status(200).json({
            message: "Admin Login successful",
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    createAdmin,
    adminLogin,
};
