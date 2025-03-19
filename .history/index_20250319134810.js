require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Debug logs
console.log("MONGO_URI:", process.env.MONGO_URI); // Debug log
console.log("PORT:", process.env.PORT); // Debug log

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    console.error("Error Details:", err.errorResponse); // Log detailed error response
  });

// Routes
const authRoutes = require("./routes/authRoutes");
const medicationRoutes = require("./routes/medicationRoutes");
const expiringMedicationRoutes = require("./routes/expiringMedicationRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/cartRoutes"); // Ensure this is the correct path

// Use routes
app.use("/api", authRoutes);
app.use("/api", medicationRoutes);
app.use("/api", expiringMedicationRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes); // Fixed typo

// Start Server
const PORT = process.env.PORT || 5009;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
