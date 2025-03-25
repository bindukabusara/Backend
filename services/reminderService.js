// services/reminderService.js
const Reminder = require('../models/Reminder');

// Safe notification service import
let sendNotification;
try {
  sendNotification = require('./notificationService').sendNotification;
} catch (error) {
  console.error('Failed to load notification service:', error);
  sendNotification = async () => {
    console.warn('Notification service not available');
  };
}

async function checkAndSendReminders() {
  try {
    const now = new Date();
    const reminders = await Reminder.find({
      nextReminderTime: { $lte: now },
      status: 'pending'
    }).populate('userId medicationId').exec();

    for (const reminder of reminders) {
      try {
        // Verify required fields exist
        if (!reminder.userId || !reminder.medicationId) {
          console.error('Reminder missing required references:', reminder._id);
          continue;
        }

        await sendNotification({
          userId: reminder.userId._id,
          title: `Time to take your ${reminder.medicationId.name}`,
          body: reminder.dosageInstructions || 'Please take your medication',
          data: {
            reminderId: reminder._id.toString(),
            medicationId: reminder.medicationId._id.toString()
          }
        });

        // Calculate next reminder time
        const nextTime = getNextReminderTime(reminder.timesToTake);
        if (nextTime) {
          reminder.nextReminderTime = nextTime;
          await reminder.save();
        }
      } catch (error) {
        console.error(`Failed to process reminder ${reminder._id}:`, error);
      }
    }
  } catch (dbError) {
    console.error('Database error in reminder service:', dbError);
  }
}

function getNextReminderTime(timesToTake) {
  if (!timesToTake || !timesToTake.length) {
    console.error('No timesToTake provided');
    return new Date(Date.now() + 24 * 60 * 60 * 1000); // Default to 24 hours later
  }

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  // Filter out invalid time strings
  const validTimes = timesToTake.filter(time =>
    time && typeof time === 'string' && time.includes(':')
  );

  if (!validTimes.length) {
    console.error('No valid times in timesToTake');
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  // Find the next time today or tomorrow
  for (const timeStr of validTimes) {
    try {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;

      if (timeInMinutes > currentTime) {
        const nextDate = new Date(now);
        nextDate.setHours(hours, minutes, 0, 0);
        return nextDate;
      }
    } catch (parseError) {
      console.error('Failed to parse time:', timeStr, parseError);
    }
  }

  // If all times passed, use first time tomorrow
  try {
    const [hours, minutes] = validTimes[0].split(':').map(Number);
    const nextDate = new Date(now);
    nextDate.setDate(nextDate.getDate() + 1);
    nextDate.setHours(hours, minutes, 0, 0);
    return nextDate;
  } catch (error) {
    console.error('Failed to calculate next reminder time:', error);
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
}

// Interval management
let reminderInterval;

function startReminderService() {
  if (reminderInterval) {
    clearInterval(reminderInterval);
  }
  // Initial run
  checkAndSendReminders();
  // Then run every minute
  reminderInterval = setInterval(checkAndSendReminders, 60 * 1000);
}

function stopReminderService() {
  if (reminderInterval) {
    clearInterval(reminderInterval);
    reminderInterval = null;
  }
}

// Export control functions
module.exports = {
  checkAndSendReminders,
  startReminderService,
  stopReminderService,
  getNextReminderTime
};
