const express = require('express');
const router = express.Router();
const { addCareTip, getCareTips, getCareTipById, updateCareTip, deleteCareTip } = require('../controllers/careTipsController');

const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles'); // Import authorizeRoles

// Routes for Care Tip operations
router.post('/', protect, authorizeRoles(['admin']), addCareTip); // Add a new tip (Admin only)
router.get('/', protect, getCareTips); // Get all tips (All authenticated users)
router.get('/:id', protect, getCareTipById); // Get a tip by ID (All authenticated users)
router.put('/:id', protect, authorizeRoles(['admin']), updateCareTip); // Update a tip by ID (Admin only)
router.delete('/:id', protect, authorizeRoles(['admin']), deleteCareTip); // Delete a tip by ID (Admin only)

module.exports = router;