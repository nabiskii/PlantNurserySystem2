const express = require('express');
const router = express.Router();
const { addCareTip, getCareTips, getCareTipById, updateCareTip, deleteCareTip } = require('../controllers/careTipsController');

const { protect } = require('../middleware/authMiddleware');

// Routes for Care Tip operations
router.post('/', protect, addCareTip); // Add a new tip
router.get('/', protect, getCareTips); // Get all tips
router.get('/:id', protect, getCareTipById); // Get a tip by ID
router.put('/:id', protect, updateCareTip); // Update a tip by ID
router.delete('/:id', protect, deleteCareTip); // Delete a tip by ID

module.exports = router;