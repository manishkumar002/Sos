const express = require('express');
const router = express.Router();
const assignedController = require('../../controllers/assignedController');  // Import the controller

// Create agent
router.post('/taskAssigned', assignedController.assignTechnician);
router.post('/taskAssignedList', assignedController.getAllTaskAssignedLists);
router.post('/getMonthlyCountTasAssigned', assignedController.getMonthlyCountTasAssigned );


module.exports = router;