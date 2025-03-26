const Cart = require("../models/CartItems");
const User = require("../models/User");
const Medication = require("../models/Medication");

// Add an item to the cart
exports.addToCart = async (req, res) => {
  try {
    const { medicationId, name, price, quantity, image, userId } = req.body;

    // Validate input
    if (!medicationId || !name || !price || !quantity || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    // Check if the item already exists in the user's cart
    const existingItem = await Cart.findOne({ medicationId, userId });
    if (existingItem) {
      // Update the quantity if the item already exists
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.status(200).json(existingItem);
    }

    // Add new item to the cart
    const newItem = new Cart({
      medicationId,
      name,
      price,
      quantity,
      image,
      userId,
    });
    await newItem.save();

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch all cart items for the logged-in user
exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming userId is extracted from the token
    const cartItems = await Cart.find({ userId });
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update the quantity of an item in the cart
exports.updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    // Validate input
    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    const updatedItem = await Cart.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove an item from the cart
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Cart.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Confirm order and save instructions
exports.confirmOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { instructions } = req.body;

    // Find the cart and update it with instructions
    const confirmedCart = await Cart.findByIdAndUpdate(
      id,
      { status: "confirmed", instructions },
      { new: true }
    );

    if (!confirmedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(confirmedCart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch all carts with user and medication details
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate("userId", "firstName lastName") // Populate user details
      .populate("medicationId", "name price image"); // Populate medication details

    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
