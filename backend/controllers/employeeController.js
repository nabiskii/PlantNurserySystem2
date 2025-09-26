const Employee = require('../models/Employee');

const addEmployee = async (req, res) => {
    try {
        const { name, email, role, phone, department, dateJoined } = req.body;
        if (!name || !email || !role) {
            return res.status(400).json({ message: 'Name, email, and role are required' });
        }

        // Basic email format check
        const emailRegex = /.+@.+\..+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee with this email already exists' });
        }

        const employee = await Employee.create({ name, email, role, phone, department, dateJoined });
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee };
