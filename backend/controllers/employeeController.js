const { employeeService } = require('../services');

// helper function to parse ints
function asInt(v, d) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : d;
}

const addEmployee = async (req, res, next) => {
    try {
        const employee = await employeeService.create(req.body, { user: req.user });
        res.status(201).json(employee);
    } catch (error) {
        next(error);
    }
};

const getEmployees = async (req, res, next) => {
    try {
        const options = {
            query: {
                q: req.query.q,
                role: req.query.role,
                department: req.query.department,
            },
            sort: req.query.sort,
            limit: asInt(req.query.limit, undefined),
            select: req.query.select,
            populate: req.query.populate,
        };
        const employees = await employeeService.findAll(options, { user: req.user });
        res.status(200).json(employees);
    } catch (error) {
        next(error);
    }
};

const getEmployeeById = async (req, res, next) => {
    try {
        const employee = await employeeService.findById(req.params.id, { 
            user: req.user,
            options: {
                select: req.query.select,
                populate: req.query.populate,
            }
        });
        res.status(200).json(employee);
    } catch (error) {
        next(error);
    }
};

const updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await employeeService.update(req.params.id, req.body, { user: req.user });
        res.status(200).json(updatedEmployee);
    } catch (error) {
        next(error);
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const removed = await employeeService.delete(req.params.id, { user: req.user });
        res.status(200).json({ message: 'Employee deleted successfully', removed });
    } catch (error) {
        next(error);
    }
};

module.exports = { addEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee };
