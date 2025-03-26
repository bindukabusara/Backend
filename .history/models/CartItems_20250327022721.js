const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    medicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Medication", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    image: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "confirmed"], default: "pending" },
    instructions: { type: String },
    additionalNotes: { type: String },
    timesToTake: [{ type: String }], // Array of times (e.g., ["08:00", "20:00"])
    reminderEnabled: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("CartItems", cartSchema);
