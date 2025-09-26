const express = require('express');
const router = express.Router();
const { addPlant, getPlants, getPlantById, updatePlant, deletePlant } = require('../controllers/plantController');

const { protect } = require('../middleware/authMiddleware');

// Routes for Plant operations
router.post('/', protect, addPlant); // Add a new plant
router.get('/', protect, getPlants); // Get all plants
router.get('/:id', protect, getPlantById); // Get a plant by ID
router.put('/:id', protect, updatePlant); // Update a plant by ID
router.delete('/:id', protect, deletePlant); // Delete a plant by ID

module.exports = router;