const express = require('express');
const router = express.Router();
const elevatorsController = require('../../controllers/elevatorController');  // Import the controller

// Create Elevator
router.post('/elevators', elevatorsController.createElevator);

// // Get all elevators
 router.get('/elevators', elevatorsController.getAllElevators);

// // Get Elevator by ID
router.get('/elevators/:id', elevatorsController.getElevatorById);

// // Update Elevator
 router.put('/elevators/:id', elevatorsController.updateElevator);

// // Delete Elevator
 router.delete('/elevators/:id', elevatorsController.deleteElevator);

module.exports = router;
