// models/Reminder.js
const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patientName: { type: String, required: true },
  medicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Medication", required: true },
  medicationName: { type: String, required: true },
  instructions: { type: String, required: true },
  additionalNotes: { type: String },
  timesToTake: [{ type: String }], // Array of times (e.g., ["08:00", "20:00"])
  status: { type: String, enum: ["active", "completed"], default: "active" },
  completedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Reminder", reminderSchema);
