// backend/routes/wishlistRoutes.js
const express = require('express');
const {
  getWishlist,
  addWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
  cloneWishlistItem,
} = require('../controllers/wishlistController');

const router = express.Router();

// GET /api/wishlist
router.get('/', getWishlist);

// POST /api/wishlist
router.post('/', addWishlistItem);

// PUT /api/wishlist/:itemId
router.put('/:itemId', updateWishlistItem);

// DELETE /api/wishlist/:itemId
router.delete('/:itemId', deleteWishlistItem);

// POST /api/wishlist/:itemId/clone
router.post('/:itemId/clone', cloneWishlistItem);

module.exports = router;
