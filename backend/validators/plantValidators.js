const { body } = require('express-validator');
const { CATEGORIES } = require('../models/Plant');

exports.createPlantRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').isIn(CATEGORIES).withMessage('Invalid category'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be >= 0'),
];

exports.updatePlantRules = [
  body('name').optional().trim().notEmpty().withMessage('Name is required'),
  body('category').optional().isIn(CATEGORIES).withMessage('Invalid category'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be >= 0'),
];
