// backend/routes/wishlistRoutes.js
const express = require('express');
const {
  getWishlist,
  addWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
  cloneWishlistItem,
} = require('../controllers/wishlistController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/wishlist
router.get('/', protect, getWishlist);

// POST /api/wishlist
router.post('/', protect, addWishlistItem);

// PUT /api/wishlist/:itemId
router.put('/:itemId', protect, updateWishlistItem);

// DELETE /api/wishlist/:itemId
router.delete('/:itemId', protect, deleteWishlistItem);

// POST /api/wishlist/:itemId/clone
router.post('/:itemId/clone', protect, cloneWishlistItem);

module.exports = router;
