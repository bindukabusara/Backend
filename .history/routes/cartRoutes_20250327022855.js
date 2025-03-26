const express = require("express");
const router = express.Router();
const {
    addToCart,
    getCartItems,
    updateQuantity,
    removeFromCart,
    confirmOrder,
    getAllCarts,
} = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

// Add an item to the cart
router.post("/add", authMiddleware, addToCart);

// Fetch all cart items for the logged-in user
router.get("/", authMiddleware, getCartItems);

// Fetch all carts (admin only)
router.get("/all", authMiddleware, getAllCarts);

// Update the quantity of an item in the cart
router.put("/:id", authMiddleware, updateQuantity);

// Remove an item from the cart
router.delete("/:id", authMiddleware, removeFromCart);

// Confirm order and save instructions
router.post("/:id/confirm", authMiddleware, confirmOrder);

module.exports = router;
