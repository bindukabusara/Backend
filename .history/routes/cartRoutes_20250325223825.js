const express = require("express");
const router = express.Router();
const {
    addToCart,
    getCartItems,
    updateQuantity,
    removeFromCart,
    confirmOrder,
} = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

// Add an item to the cart
router.post("/add", authMiddleware, addToCart);

// Fetch all cart items for the logged-in user
router.get("/", authMiddleware, getCartItems);
const { getAllCarts } = require("../controllers/cartController");

// Fetch all carts
router.get("/all", getAllCarts);

// Fetch all carts (for pharmacist)
router.get("/all", async (req, res) => {
    try {
        const carts = await Cart.find().populate("userId", "firstName lastName");
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update the quantity of an item in the cart
router.put("/:id", authMiddleware, updateQuantity);

// Remove an item from the cart
router.delete("/:id", authMiddleware, removeFromCart);

// Confirm order and save instructions
router.post("/:id/confirm", confirmOrder);

module.exports = router;

