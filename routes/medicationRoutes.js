const express = require("express");
const router = express.Router();
const medicationController = require("../controllers/medicationController");
const multer = require("multer");
const path = require("path");

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Medication routes
router.post("/medications", upload.single("image"), medicationController.createMedication);
router.get("/medications", medicationController.getAllMedications);
router.get("/medications/:id", medicationController.getMedicationById);
router.put("/medications/:id", upload.single("image"), medicationController.updateMedication);
router.delete("/medications/:id", medicationController.deleteMedication);
router.get("/medications/search", medicationController.searchMedications);

module.exports = router;
