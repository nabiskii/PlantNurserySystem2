const Base = require('./BaseInventoryService');
const Employee = require('../models/Employee');

class EmployeeService extends Base {
    async validate(data, ctx) {
        if (ctx.op === 'create') {
            if (!data?.name) {
                const e = new Error('Name is required');
                e.status = 400;
                throw e;
            }
            if (!data?.email) {
                const e = new Error('Email is required');
                e.status = 400;
                throw e;
            }
            if (!data?.role) {
                const e = new Error('Role is required');
                e.status = 400;
                throw e;
            }
        }
        return data;
    }

    async create(data, ctx) {
        try {
            return await super.create(data, ctx);
        }
        catch (error) {
            if (error.code === 11000 || error.code === 11001) {
                const e = new Error('An employee with this email already exists');
                e.status = 400;
                throw e;
            }
            throw error;
        }
    }

    async update(id, data, ctx) {
        try {
            return await super.update(id, data, ctx);
        }
        catch (error) {
            if (error.code === 11000 || error.code === 11001) {
                const e = new Error('An employee with this email already exists');
                e.status = 400;
                throw e;
            }
            throw error;
        }
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