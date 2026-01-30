const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name cannot exceed 50 characters"]
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"]
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            match: [
                /^[0-9]{10,15}$/,
                "Phone number must be 10 to 15 digits"
            ]
        },

        company: {
            type: String,
            required: [true, "Company is required"],
            trim: true,
            minlength: [2, "Company name is too short"],
            maxlength: [100, "Company name is too long"]
        },

        country: {
            type: String,
            required: [true, "Country is required"],
            trim: true,
            minlength: [2, "Invalid country name"]
        },

        designation: {
            type: String,
            required: [true, "Designation is required"],
            enum: {
                values: ["Developer", "Manager", "Student", "Other"],
                message: "Invalid designation selected"
            }
        },

        status: {
            type: Boolean,
            default: false
        },

        resetToken: {
            type: String,
            default: null
        },

        resetTokenExpire: {
            type: Date,
            default: null
        },
        authToken: {
            type: String, default: null
        }

    },

    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);
