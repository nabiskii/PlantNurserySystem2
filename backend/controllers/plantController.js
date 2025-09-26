const Plant = require ('../models/Plant');

const addPlant = async (req, res) => {
    try {
        const { name, category, price, description } = req.body;
        if (!name || !category || !price) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (typeof price !== 'number' || price < 0) {
            return res.status(400).json({ message: 'Price must be a positive number' });
        }
        const existingPlant = await Plant.findOne({ name });
        if (existingPlant) {
            return res.status(400).json({ message: 'Plant with this name already exists' });
        }

        const plant = await Plant.create({ name, category, price, description });
        res.status(201).json(plant);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// getting all plants

const getPlants = async (req, res) => {
    try {
        const plants = await Plant.find();
        res.status(200).json(plants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPlantById = async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id);
        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }
        res.status(200).json(plant);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePlant = async (req, res) => {
    try {
        const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!updatedPlant) {
            return res.status(404).json({ message: 'Plant not found' });
        }
        res.status(200).json(updatedPlant);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePlant = async (req, res) => {
    try {
        const deletedPlant = await Plant.findByIdAndDelete(req.params.id);
        if (!deletedPlant) {
            return res.status(404).json({ message: 'Plant not found' });
        }
        res.status(200).json({ message: 'Plant deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addPlant, getPlants, getPlantById, updatePlant, deletePlant };