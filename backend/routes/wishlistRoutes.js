const express = require('express');
const router = express.Router();
const { addItem, getWishlist, cloneItem, updateItem, deleteItem, getAllWishlists } = require('../controllers/wishlistController');

const { protect } = require('../middleware/authMiddleware');

// Routes for Plant operations
router.post('/', protect, addItem);
router.get('/', protect, getWishlist); 
router.get('/', getAllWishlists)
router.get('/:id', protect, cloneItem); 
router.put('/:id', protect, updateItem); 
router.delete('/:id', protect, deleteItem); 

module.exports = router;