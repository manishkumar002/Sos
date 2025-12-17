const express = require('express');
const router = express.Router();
const agentController = require('../../controllers/agentController');  // Import the controller

// Create agent
router.post('/agent', agentController.createAgent);

// // Get all agent
 router.post('/allAgent', agentController.getAllAgent);

// // Get agent by ID
// router.get('/technicians/:id', technicianController.getTechnicianById);

// // Update agent
 router.put('/agent/:id', agentController.updateAgent);

// // Delete agent
 router.delete('/agent/:id', agentController.deleteAgent);


 router.post('/getMonthlyCountAgent', agentController.getMonthlyCountAgent);
 router.post('/getMonthlyCountUser', agentController.getMonthlyCountUser);

 

module.exports = router;
