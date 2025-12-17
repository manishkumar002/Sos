const express = require("express");
const router = express.Router();
const technicianController = require("../../controllers/technicianController"); // Import the controller

// Create Technician
router.post("/technicians", technicianController.createTechnician);

// // Get all Technicians
router.post("/allTechnicians", technicianController.getAllTechnicians);

router.post(
  "/getAllTechniciansForAdmin",
  technicianController.getAllTechniciansForAdmin
);

// // Get Technician by ID
router.get("/technicians/:id", technicianController.getTechnicianById);

// // Update Technician
router.put("/technicians/:id", technicianController.updateTechnician);

// // Delete Technician
router.delete("/technicians/:id", technicianController.deleteTechnician);

// // getTechniciansByZipCode

router.get(
  "/getTechniciansByZip",
  technicianController.getTechniciansByZipCode
);

router.post(
  "/getMonthlyCountTechnician",
  technicianController.getMonthlyCallListCountTechnician
);

module.exports = router;
