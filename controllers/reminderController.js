const Reminder = require("../models/Reminder");
const CartItems = require("../models/CartItems"); // Updated to use CartItems

// Create reminder from confirmed cart items
exports.createFromCart = async (req, res) => {
  try {
    const cartItem = await CartItems.findById(req.params.cartItemId)
      .populate('userId')
      .populate('medicationId');

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Only create reminder if cart item is confirmed
    if (cartItem.status !== "confirmed") {
      return res.status(400).json({ message: "Can only create reminders from confirmed cart items" });
    }

    const reminder = new Reminder({
      patientId: cartItem.userId._id,
      patientName: `${cartItem.userId.firstName} ${cartItem.userId.lastName}`,
      medicationId: cartItem.medicationId._id,
      medicationName: cartItem.medicationId.name,
      instructions: cartItem.instructions,
      timesToTake: cartItem.timesToTake,
      additionalNotes: cartItem.additionalNotes,
      status: "active"
    });

    await reminder.save();
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all reminders for a patient
exports.getPatientReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ patientId: req.params.patientId });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all reminders (for admin/pharmacist)
exports.getAllReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark reminder as completed
exports.completeReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.reminderId);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    reminder.status = "completed";
    reminder.completedAt = new Date();
    await reminder.save();

    res.json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check for due reminders
exports.checkDueReminders = async (req, res) => {
  try {
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    const dueReminders = await Reminder.find({
      timesToTake: currentTime,
      status: "active"
    });

    res.json(dueReminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
