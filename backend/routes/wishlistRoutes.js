// backend/routes/wishlistRoutes.js
const express = require('express');
const {
  getWishlist,
  addWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
  cloneWishlistItem,
} = require('../controllers/wishlistController');

const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

const router = express.Router();

// GET /api/wishlist
router.get('/', protect, getWishlist); // Apply protect middleware

// POST /api/wishlist
router.post('/', protect, addWishlistItem); // Apply protect middleware

// PUT /api/wishlist/:itemId
router.put('/:itemId', protect, updateWishlistItem); // Apply protect middleware

// DELETE /api/wishlist/:itemId
router.delete('/:itemId', protect, deleteWishlistItem); // Apply protect middleware

// POST /api/wishlist/:itemId/clone
router.post('/:itemId/clone', protect, cloneWishlistItem); // Apply protect middleware

module.exports = router;
