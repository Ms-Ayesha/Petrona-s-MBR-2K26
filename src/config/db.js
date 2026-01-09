const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        const MongooseOptions = {
            dbName: "MBR_2K26",
            connectTimeoutMS: 30000, // Optional: Adjust as needed
            socketTimeoutMS: 45000   // Optional: Adjust as needed
          };
        await mongoose.connect(process.env.MONGO_URI, MongooseOptions);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log(" Database connection Error", error);
    }
};
module.exports = connectDB;