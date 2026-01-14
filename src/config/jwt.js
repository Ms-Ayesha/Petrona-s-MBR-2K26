// config/jwt.js
console.log("JWT_SECRET used in config/jwt.js →", process.env.JWT_SECRET || "secretkey"); // ← ADD THIS

module.exports = {
  secret: process.env.JWT_SECRET || "secretkey",
  expiresIn: "1h",
};