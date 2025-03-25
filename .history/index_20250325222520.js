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

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
const authRoutes = require("./routes/authRoutes");
const medicationRoutes = require("./routes/medicationRoutes");
const expiringMedicationRoutes = require("./routes/expiringMedicationRoutes");
const cartRoutes = require("./routes/cartRoutes"); // Declare cartRoutes once
const orderRoutes = require("./routes/cartRoutes");
const reminderRoutes = require('./routes/reminderRoutes');


// Use routes
app.use("/api", authRoutes);
app.use("/api", medicationRoutes);
app.use("/api", expiringMedicationRoutes);
app.use("/api/cart", cartRoutes); // Use cartRoutes once
app.use("api/oder", orderRoutes); // Add order routes
app.use('/api/reminders', reminderRoutes);



// Start the reminder service
require('./services/reminderService');


// Start Server
const PORT = process.env.PORT || 5009;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
