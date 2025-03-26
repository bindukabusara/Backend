const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

// Add this new route for getting confirmed orders
router.get("/confirmed", authMiddleware, orderController.getConfirmedOrders);

// Existing routes
router.get("/", authMiddleware, orderController.getOrders);
router.post("/provide-instructions", authMiddleware, orderController.provideInstructions);

module.exports = router;
