const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  expireDate: { type: Date, required: true }, // Add expireDate field
  location: { type: String, required: true },
});

module.exports = mongoose.model("Medication", medicationSchema);
