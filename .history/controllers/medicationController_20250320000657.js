const Medication = require("../models/Medication");

// Create a new medication
exports.createMedication = async (req, res) => {
  try {
    const { name, description, quantity, price, expireDate, location } = req.body;
    const image = req.file ? req.file.filename : "";

    const newMedication = new Medication({
      name,
      description,
      quantity,
      price,
      image,
      expireDate,
      location,
    });

    await newMedication.save();
    res.status(201).json(newMedication);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all medications
exports.getAllMedications = async (req, res) => {
  try {
    const medications = await Medication.find();
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single medication by ID
exports.getMedicationById = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }
    res.json(medication);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a medication
exports.updateMedication = async (req, res) => {
  try {
    const { name, description, quantity, price, expireDate, location } = req.body;
    const image = req.file ? req.file.filename : req.body.image;

    const updatedMedication = await Medication.findByIdAndUpdate(
      req.params.id,
      { name, description, quantity, price, image, expireDate, location },
      { new: true }
    );

    if (!updatedMedication) {
      return res.status(404).json({ message: "Medication not found" });
    }

    res.json(updatedMedication);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a medication
exports.deleteMedication = async (req, res) => {
  try {
    const deletedMedication = await Medication.findByIdAndDelete(req.params.id);
    if (!deletedMedication) {
      return res.status(404).json({ message: "Medication not found" });
    }
    res.json({ message: "Medication deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Search medications by name
exports.searchMedications = async (req, res) => {
  try {
    const { query } = req.query;
    console.log("Search Query:", query); // Log the query for debugging

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const medications = await Medication.find({
      name: { $regex: query, $options: "i" },
    });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete all expired medications
exports.deleteAllExpiredMedications = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date
    const result = await Medication.deleteMany({ expireDate: { $lt: currentDate } }); // Delete medications with expireDate less than current date
    res.json({ message: `${result.deletedCount} expired medications deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
