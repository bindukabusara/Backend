const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Fetch all orders
router.get("/orders", orderController.getOrders);

// Provide instructions and update medication quantity
router.post("/orders/provide-instructions", orderController.provideInstructions);

module.exports = router;
