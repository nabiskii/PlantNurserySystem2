const express = require('express');
const router = express.Router();
const { addEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee } = require('../controllers/employeeController');

const { protect } = require('../middleware/authMiddleware');

// Routes for Employee operations
router.post('/', protect, addEmployee); // Add a new employee
router.get('/', protect, getEmployees); // Get all employees
router.get('/:id', protect, getEmployeeById); // Get an employee by ID
router.put('/:id', protect, updateEmployee); // Update an employee by ID
router.delete('/:id', protect, deleteEmployee); // Delete an employee by ID

module.exports = router;
