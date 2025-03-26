const Cart = require("../models/CartItems");
const Medication = require("../models/Medication");
const User = require("../models/User");

// Add an item to the cart
exports.addToCart = async (req, res) => {
  try {
    const { medicationId, name, price, quantity, image, userId } = req.body;

    if (!medicationId || !name || !price || !quantity || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be positive" });
    }

    const existingItem = await Cart.findOne({ medicationId, userId });
    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.status(200).json(existingItem);
    }

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

// Fetch all cart items for user
exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cartItems = await Cart.find({ userId });
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update cart item quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be positive" });
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

// Remove item from cart
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

// Confirm order and update medication stock
exports.confirmOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { instructions, additionalNotes, timesToTake } = req.body;

    const cartItem = await Cart.findById(id).populate('medicationId');
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const medication = await Medication.findById(cartItem.medicationId._id);
    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }

    if (medication.quantity < cartItem.quantity) {
      return res.status(400).json({
        message: `Only ${medication.quantity} available (requested ${cartItem.quantity})`
      });
    }

    medication.quantity -= cartItem.quantity;
    await medication.save();

    const confirmedCart = await Cart.findByIdAndUpdate(
      id,
      {
        status: "confirmed",
        instructions,
        additionalNotes,
        timesToTake: timesToTake.filter(time => time !== ""),
        reminderEnabled: true
      },
      { new: true }
    ).populate('userId medicationId');

    res.status(200).json({
      message: "Order confirmed and stock updated",
      cart: confirmedCart,
      remainingStock: medication.quantity
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all carts with details
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate("userId", "firstName lastName email phoneNumber")
      .populate("medicationId", "name price image description");

    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// In cartController.js - update the confirmOrder function
const Reminder = require("../models/Reminder"); // Add this at top

exports.confirmOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { instructions, additionalNotes, timesToTake } = req.body;

    const cartItem = await Cart.findById(id)
      .populate('medicationId')
      .populate('userId');

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const medication = await Medication.findById(cartItem.medicationId._id);
    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }

    if (medication.quantity < cartItem.quantity) {
      return res.status(400).json({
        message: `Only ${medication.quantity} available (requested ${cartItem.quantity})`
      });
    }

    // Update medication stock
    medication.quantity -= cartItem.quantity;
    await medication.save();

    // Create new reminder
    const newReminder = new Reminder({
      patientId: cartItem.userId._id,
      patientName: `${cartItem.userId.firstName} ${cartItem.userId.lastName}`,
      medicationId: cartItem.medicationId._id,
      medicationName: cartItem.medicationId.name,
      instructions,
      additionalNotes,
      timesToTake: timesToTake.filter(time => time !== ""),
      status: "active"
    });
    await newReminder.save();

    // Update cart status
    const confirmedCart = await Cart.findByIdAndUpdate(
      id,
      {
        status: "confirmed",
        instructions,
        additionalNotes,
        timesToTake: timesToTake.filter(time => time !== ""),
        reminderEnabled: true
      },
      { new: true }
    ).populate('userId medicationId');

    res.status(200).json({
      message: "Order confirmed, stock updated, and reminder created",
      cart: confirmedCart,
      remainingStock: medication.quantity
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
