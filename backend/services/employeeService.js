const Base = require('./BaseInventoryService');
const Employee = require('../models/Employee');

class EmployeeService extends Base {
    async validate(data) {
        if (!data?.name) {
            const e = new Error('Name is required');
            e.status = 400;
            throw e;
        }
        return data;
    }

    async filter (data) {
        const filter = {};
        if (data.data) {
            filter.$or = [
                { name: { $regex: data.data, $options: 'i' } },
                { email: { $regex: data.data, $options: 'i' } },
            ];
        }
        if (data.role) {
            filter.role = data.role;
        }
        return filter;
    }
}

module.exports = new EmployeeService(Employee);