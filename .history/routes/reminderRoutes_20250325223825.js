const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const Cart = require('../models/CartItems'); // Updated import
const { authenticate } = require('../middleware/authMiddleware');

// Save medication instructions
router.put('/:cartId/confirm', authenticate, async (req, res) => {
  try {
    const { instructions, additionalNotes, timesToTake } = req.body;

    // Update the cart
    const cart = await Cart.findByIdAndUpdate(
      req.params.cartId,
      {
        status: 'confirmed',
        instructions,
        additionalNotes,
        timesToTake: timesToTake.filter(time => time !== '')
      },
      { new: true }
    );

    // Create a new reminder
    const reminder = new Reminder({
      userId: cart.userId,
      medicationId: cart.medicationId,
      cartId: cart._id,
      dosageInstructions: instructions,
      timesToTake: timesToTake.filter(time => time !== ''),
      additionalNotes,
      nextReminderTime: calculateNextReminderTime(timesToTake[0]) // Implement this function
    });

    await reminder.save();

    res.status(200).json({
      message: 'Instructions saved successfully',
      cart,
      reminder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to calculate next reminder time
function calculateNextReminderTime(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const now = new Date();
  const reminderTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0
  );

  // If the time has already passed today, set for tomorrow
  if (reminderTime < now) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }

  return reminderTime;
}

module.exports = router;
