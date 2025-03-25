// services/reminderService.js
const Reminder = require('../models/Reminder');
const { sendNotification } = require('./notificationService');

async function checkAndSendReminders() {
  const now = new Date();
  const reminders = await Reminder.find({
    nextReminderTime: { $lte: now },
    status: 'pending'
  }).populate('userId medicationId');

  for (const reminder of reminders) {
    try {
      await sendNotification({
        userId: reminder.userId._id,
        title: `Time to take your ${reminder.medicationId.name}`,
        body: reminder.dosageInstructions,
        data: {
          reminderId: reminder._id.toString(),
          medicationId: reminder.medicationId._id.toString()
        }
      });

      // Calculate next reminder time
      const nextTime = getNextReminderTime(reminder.timesToTake);
      reminder.nextReminderTime = nextTime;
      await reminder.save();
    } catch (error) {
      console.error(`Failed to send reminder ${reminder._id}:`, error);
    }
  }
}

function getNextReminderTime(timesToTake) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  // Find the next time today or tomorrow
  for (const timeStr of timesToTake) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;

    if (timeInMinutes > currentTime) {
      const nextDate = new Date(now);
      nextDate.setHours(hours, minutes, 0, 0);
      return nextDate;
    }
  }

  // If all times passed, use first time tomorrow
  const [hours, minutes] = timesToTake[0].split(':').map(Number);
  const nextDate = new Date(now);
  nextDate.setDate(nextDate.getDate() + 1);
  nextDate.setHours(hours, minutes, 0, 0);
  return nextDate;
}

// Run every minute
setInterval(checkAndSendReminders, 60 * 1000);

module.exports = { checkAndSendReminders };
