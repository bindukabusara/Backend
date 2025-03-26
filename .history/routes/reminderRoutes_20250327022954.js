// reminderRoutes.js
const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminderController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all reminders
router.get("/", authMiddleware, reminderController.getAllReminders);

// Get due reminders
router.get("/due", authMiddleware, reminderController.checkDueReminders);

// Mark reminder as completed
router.post("/:reminderId/complete", authMiddleware, reminderController.completeReminder);

module.exports = router;
