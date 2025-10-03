const express = require('express');
const router = express.Router();
const { addPlant, getPlants, getPlantById, updatePlant, deletePlant } = require('../controllers/plantController');

const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles'); // Import authorizeRoles

// Routes for Plant operations
router.post('/', protect, authorizeRoles(['admin']), addPlant); // Add a new plant (Admin only)
router.get('/', protect, getPlants); // Get all plants (All authenticated users)
router.get('/:id', protect, getPlantById); // Get a plant by ID (All authenticated users)
router.put('/:id', protect, authorizeRoles(['admin']), updatePlant); // Update a plant by ID (Admin only)
router.delete('/:id', protect, authorizeRoles(['admin']), deletePlant); // Delete a plant by ID (Admin only)

module.exports = router;