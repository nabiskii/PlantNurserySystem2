const { plantService } = require('../services');

// helper function to parse ints
function asInt(value, defaultValue) {
    const parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : defaultValue;
}

// POST /api/plants
const addPlant = async (req, res, next) => {
    try {
        const plant = await plantService.create(req.body, { user: req.user });
        res.status(201).json(plant);
    }
    catch (error) {
        next(error);
    }
};

// GET /api/plants
const getPlants = async (req, res, next) => {
    try {
        const options = {
            query: {
                name: req.query.name,
                category: req.query.category,
                available: req.query.available,
            },
            sort: req.query.sort,
            limit: asInt(req.query.limit, undefined),
            select: req.query.select,
            populate: req.query.populate,
        };
        const plants = await plantService.findAll(options, { user: req.user });
        res.status(200).json(plants);

    } catch (error) {
        next(error);
    }
};

// GET /api/plants/:id
const getPlantById = async (req, res, next) => {
    try {
        const plant = await plantService.findById(req.params.id, { 
            user: req.user,
            options: {
                select: req.query.select,
                populate: req.query.populate,
            }
        });
        res.status(200).json(plant);
    }
    catch (error) {
        next(error);
    }
};

// PUT /api/plants/:id
const updatePlant = async (req, res, next) => {
    try {
        const updatedPlant = await plantService.update(req.params.id, req.body, { user: req.user });
        res.status(200).json(updatedPlant);
    }
    catch (error) {
        next(error);
    }
};

// DELETE /api/plants/:id
const deletePlant = async (req, res, next) => {
    try {
        const removed = await plantService.delete(req.params.id, { user: req.user });
        res.status(200).json({ message: 'Plant deleted successfully!', removed });
    }
    catch (error) {
        next(error);
    }
};

module.exports = { addPlant, getPlants, getPlantById, updatePlant, deletePlant };