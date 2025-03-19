const express = require("express");
const router = express.Router();
const expiringMedicationController = require("../controllers/expiringMedicationController");

// Existing routes
router.get("/expired", expiringMedicationController.getExpiredMedications);
router.get("/expiring-soon", expiringMedicationController.getExpiringSoonMedications);
router.get("/expiring-in-three-months", expiringMedicationController.getExpiringInThreeMonthsMedications);
router.get("/by-expire-date", expiringMedicationController.getMedicationsByExpireDate);
router.get("/expired-by-month", expiringMedicationController.getExpiredByMonth);

// New routes
router.get("/low-quantity", expiringMedicationController.getLowQuantityMedications);
router.get("/non-expired-in-stock", expiringMedicationController.getNonExpiredMedicationsInStock);

module.exports = router;
