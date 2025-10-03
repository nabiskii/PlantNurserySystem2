const express = require('express');
const router = express.Router();
const { addEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee } = require('../controllers/employeeController');

const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles'); // Import authorizeRoles

// Routes for Employee operations
router.post('/', protect, authorizeRoles(['admin']), addEmployee); // Add a new employee (Admin only)
router.get('/', protect, getEmployees); // Get all employees (All authenticated users)
router.get('/:id', protect, getEmployeeById); // Get an employee by ID (All authenticated users)
router.put('/:id', protect, authorizeRoles(['admin']), updateEmployee); // Update an employee by ID (Admin only)
router.delete('/:id', protect, authorizeRoles(['admin']), deleteEmployee); // Delete an employee by ID (Admin only)

module.exports = router;
