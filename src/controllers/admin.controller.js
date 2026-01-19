const bcrypt = require("bcrypt");
const Admin = require("../models/admin.model");
const generateToken = require("../utils/generateToken");

const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required",
            });
        }

        const emailExists = await Admin.findOne({ email });
        if (emailExists) {
            return res.status(400).json({
                message: "Admin with this email already exists",
            });
        }

        const newAdmin = await Admin.create({
            name,
            email,
            password,
        });

        res.status(201).json({
            message: "Admin created successfully",
            admin: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
            },
        });

    } catch (error) {
        res.status(500).json({
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

        admin.token = token;
        await admin.save();

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
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
