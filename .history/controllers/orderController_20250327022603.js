const Cart = require("../models/CartItems");
const Medication = require("../models/Medication");

// Fetch all confirmed orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Cart.find({ status: "confirmed" }).populate("userId", "firstName lastName");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Provide instructions and update medication quantity
exports.provideInstructions = async (req, res) => {
  try {
    const { orderId, instructions, quantity } = req.body;

    // Find the order
    const order = await Cart.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Find the medication
    const medication = await Medication.findById(order.medicationId);
    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }

    // Ensure the quantity doesn't go below 0
    if (medication.quantity - quantity < 0) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Update medication quantity
    medication.quantity -= quantity;
    await medication.save();

    // Save instructions (you can store this in the order or another collection)
    order.instructions = instructions;
    await order.save();

    res.status(200).json({ message: "Instructions saved and quantity updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add this new method
exports.getConfirmedOrders = async (req, res) => {
  try {
    const orders = await Cart.find({ status: "confirmed" })
      .populate("userId", "firstName lastName")
      .populate("medicationId", "name image description");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Keep existing methods...
