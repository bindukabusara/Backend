require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// Routes
const authRoutes = require("./routes/authRoutes");
const medicationRoutes = require("./routes/medicationRoutes");
const expiringMedicationRoutes = require("./routes/expiringMedicationRoutes");
const cartRoutes = require("./routes/cartRoutes"); // Declare cartRoutes once
const orderRoutes = require("./routes/cartRoutes");


// Use routes
app.use("/api", authRoutes);
app.use("/api", medicationRoutes);
app.use("/api", expiringMedicationRoutes);
app.use("/api/cart", cartRoutes); // Use cartRoutes once
app.use("api/oder", orderRoutes); // Add order routes


// Start Server
const PORT = process.env.PORT || 5009;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
