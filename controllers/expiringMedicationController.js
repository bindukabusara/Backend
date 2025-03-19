const Medication = require("../models/Medication");

// Get medications that are expired
exports.getExpiredMedications = async (req, res) => {
  try {
    const currentDate = new Date();
    const medications = await Medication.find({ expireDate: { $lt: currentDate } });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get medications that will expire in less than one week
exports.getExpiringSoonMedications = async (req, res) => {
  try {
    const currentDate = new Date();
    const oneWeekFromNow = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const medications = await Medication.find({
      expireDate: { $gt: currentDate, $lt: oneWeekFromNow },
    });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get medications that will expire in less than three months
exports.getExpiringInThreeMonthsMedications = async (req, res) => {
  try {
    const currentDate = new Date();
    const threeMonthsFromNow = new Date(currentDate.getTime() + 90 * 24 * 60 * 60 * 1000);
    const medications = await Medication.find({
      expireDate: { $gt: currentDate, $lt: threeMonthsFromNow },
    });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get medications by expire date
exports.getMedicationsByExpireDate = async (req, res) => {
  try {
    const { date } = req.query; // Extract date from query parameters
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const expireDate = new Date(date);
    const medications = await Medication.find({ expireDate: expireDate });

    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get expired medications by month
exports.getExpiredByMonth = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ message: "Year is required" });
    }

    // Array to store the count of expired medications for each month
    const expiredByMonth = [];

    // Loop through each month (1-12)
    for (let month = 1; month <= 12; month++) {
      // Calculate the start and end dates for the selected month and year
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // Fetch the count of medications that expired within the selected month
      const count = await Medication.countDocuments({
        expireDate: { $gte: startDate, $lte: endDate },
      });

      // Add the month and count to the array
      expiredByMonth.push({ month, count });
    }

    res.json(expiredByMonth);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get medications with low quantity (less than 20) and not expired
exports.getLowQuantityMedications = async (req, res) => {
  try {
    const currentDate = new Date();
    const medications = await Medication.find({
      quantity: { $lt: 20 },
      expireDate: { $gt: currentDate }, // Only include non-expired medications
    });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get medications that are in stock and not expired
exports.getNonExpiredMedicationsInStock = async (req, res) => {
  try {
    const currentDate = new Date();
    const medications = await Medication.find({
      quantity: { $gt: 0 }, // Medications with quantity greater than 0
      expireDate: { $gt: currentDate }, // Only include non-expired medications
    });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
