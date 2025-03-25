const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const Cart = require('../models/CartItems');
const authenticate = require('../middleware/authMiddleware'); // Updated import

// Save medication instructions
router.put('/:cartId/confirm', authenticate, async (req, res) => {
  try {
    const { instructions, additionalNotes, timesToTake } = req.body;

    if (!timesToTake || !Array.isArray(timesToTake)) {
      return res.status(400).json({ message: 'Invalid timesToTake format' });
    }

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

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const reminder = new Reminder({
      userId: cart.userId,
      medicationId: cart.medicationId,
      cartId: cart._id,
      dosageInstructions: instructions,
      timesToTake: timesToTake.filter(time => time !== ''),
      additionalNotes,
      nextReminderTime: calculateNextReminderTime(timesToTake[0])
    });

    await reminder.save();

    res.status(200).json({
      message: 'Instructions saved successfully',
      cart,
      reminder
    });
  } catch (error) {
    console.error('Error in reminder confirmation:', error);
    res.status(500).json({ message: error.message });
  }
});

function calculateNextReminderTime(timeString) {
  if (!timeString) return new Date();

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

  if (reminderTime < now) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }

  return reminderTime;
}

module.exports = router;
