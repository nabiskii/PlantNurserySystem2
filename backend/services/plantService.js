const Base = require('./BaseInventoryService');
const Plant = require('../models/Plant');

class PlantService extends Base {
    async validate(data) {
        if (!data?.name) {
            const e = new Error('Name is required');
            e.status = 400;
            throw e;
        }
        if (data?.price != null && data.price < 0) {
            const e = new Error('Price cannot be negative');
            e.status = 400;
            throw e;
        }
        return data;
    }

    async filter (data) {
        const filter = {};
        if (data?.name) {
            filter.name = { $regex: data.name, $options: 'i' };
        }
        if (data.category) {
            filter.category = data.category;
        }
        if (data.available === 'true' || data.available === true) {
            filter.stock = { $gt: 0 };
        }
        return filter;
    }

    async formatOutput(data) {
        const decorate = (item) => ({
            ...item, inStock: (item.stock ?? 0) > 0
        });
        return Array.isArray(data) ? data.map(decorate) : decorate(data);
    }
}

module.exports = new PlantService(Plant);