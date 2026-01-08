const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log(" Database connection Error", error);
        process.exit(1);
    }
};

module.exports = connectDB;
