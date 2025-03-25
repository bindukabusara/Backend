const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    pharmacyName: { type: String },
    licenseNumber: { type: String },
    phoneNumber: { type: String },
    role: { type: String, enum: ["storeManager", "saler", "patient"], required: true },
});

module.exports = mongoose.model("User", userSchema);
