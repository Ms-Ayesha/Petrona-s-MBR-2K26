// src/controllers/auth.controller.js
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");
const sendEmail = require("../utils/sendEmail");

const generateToken = (payload, expiresIn = "24h") => {
    return jwt.sign(payload, secret, { expiresIn });
};

const signup = async (req, res) => {
    const { name, email, password, phone, company, country, designation } = req.body;

    try {
        const existingUser = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const newUser = await User.create({
            name,
            email: email.trim().toLowerCase(),
            password,
            phone,
            company,
            country,
            designation,
        });

        const activationToken = generateToken({ id: newUser._id }, "24h");

        const activationLink = `${process.env.BACKEND_URL}/api/auth/activate/${activationToken}`;

        await sendEmail(
            newUser.email,
            "Activate Your MBR Account",
            "confirmEmail.html",
            { name, company, designation, country, activationLink }
        );

        return res.status(201).json({
            message: "Please check your email and click the activation link.",
        });

    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({
                message: Object.values(err.errors)[0].message
            });
        }

        console.error("Signup error:", err);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

const activateAccount = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.send("<h2 style='color:red; text-align:center;'>Invalid Link</h2>");
        }

        if (user.status) {
            return res.send("<h2 style='color:green; text-align:center;'>Account Already Activated</h2>");
        }
        user.status = true;
        await user.save();

        return res.send(`
      <div style="text-align:center; margin-top:100px; font-family:Arial;">
        <h1 style="color:green;">✓ Account Activated Successfully!</h1>
        <p>You can now log in with your email and password.</p>
      </div>
    `);
    } catch (err) {
        console.error("Activation error:", err);
        return res.send(`
      <div style="text-align:center; margin-top:100px; font-family:Arial;">
        <h1 style="color:red;">Link Expired or Invalid</h1>
        <p>Please register again.</p>
      </div>
    `);
    }
};
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (!user.status) {
            return res.status(400).json({ message: "Please activate your account by clicking the link in your email" });
        }

        const token = jwt.sign({ id: user._id }, secret, { expiresIn: "24h" });

        user.authToken = token;
        await user.save();

        return res.json({
            message: "Login successful",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                company: user.company,
                country: user.country,
                designation: user.designation,
            },
            token,
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};


const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) return res.status(400).json({ message: "Email not found" });

        const resetToken = generateToken({ id: user._id }, "15m");
        user.resetToken = resetToken;
        user.resetTokenExpire = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        console.log("Reset Link:", resetLink);

        await sendEmail(
            email,
            "Password Reset Request",
            "resetpassword.html",
            { name: user.name, resetLink }
        );

        res.json({ message: "Password reset link sent to your email" });
    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ message: "Failed to send reset email" });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const decoded = jwt.verify(token, secret);

        const user = await User.findOne({
            _id: decoded.id,
            resetToken: token,
            resetTokenExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        user.password = password;
        user.resetToken = null;
        user.resetTokenExpire = null;

        await user.save();

        res.json({ message: "Password reset successfully" });

    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({
                message: Object.values(err.errors)[0].message
            });
        }

        console.error("Reset password error:", err);
        res.status(400).json({ message: "Invalid or expired token" });
    }
};


module.exports = {
    signup,
    activateAccount,
    login,
    forgotPassword,
    resetPassword,
};
