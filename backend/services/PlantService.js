const Base = require('./BaseInventoryService');
const Plant = require('../models/Plant');
const Wishlist = require('../models/wishlistModel');

class PlantService extends Base {
    async validate(data, ctx) {
        if (ctx.op === 'create' && !data?.name) {
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

    async create(data, ctx) {
        try {
            return await super.create(data, ctx);
        }
        catch (error) {
            if (error.code === 11000 || error.code === 11001) {
                const e = new Error('A plant with this name already exists');
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
                const e = new Error('A plant with this name already exists');
                e.status = 400;
                throw e;
            }
            throw error;
        }
    }

    async delete(id, ctx) {
        const removedPlant = await super.delete(id, ctx); // Delete the plant first

        if (removedPlant) {
            // Remove all wishlist items that reference the deleted plantId
            await Wishlist.updateMany(
                { 'items.plantId': id },
                { $pull: { items: { plantId: id } } }
            );
        }
        return removedPlant;
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