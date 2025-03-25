// services/notificationService.js
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require('../path/to/your/firebase-credentials.json'))
});

async function sendNotification({ userId, title, body, data }) {
  try {
    // In a real app, you would get the device token from the user's profile
    const user = await User.findById(userId);
    if (!user || !user.deviceToken) return;

    const message = {
      token: user.deviceToken,
      notification: {
        title,
        body
      },
      data
    };

    await admin.messaging().send(message);
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

module.exports = { sendNotification };
