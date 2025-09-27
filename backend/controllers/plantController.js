const { plantService } = require('../services');

// helper function to parse ints
function asInt(value, defaultValue) {
    const parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : defaultValue;
}

// POST /api/plants
const addPlant = async (req, res) => {
    try {
        const plant = await plantService.create(req.body, { user: req.user });
        res.status(201).json(plant);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/plants
const getPlants = async (req, res) => {
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
        res.status(500).json({ message: error.message });
    }
};

// GET /api/plants/:id
const getPlantById = async (req, res) => {
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
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/plants/:id
const updatePlant = async (req, res) => {
    try {
        const updatedPlant = await plantService.update(req.params.id, req.body, { user: req.user });
        res.status(200).json(updatedPlant);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/plants/:id
const deletePlant = async (req, res) => {
    try {
        const removed = await plantService.delete(req.params.id, { user: req.user });
        res.status(200).json({ message: 'Plant deleted successfully!', removed });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addPlant, getPlants, getPlantById, updatePlant, deletePlant };