const express = require('express');
const { getWishlist, addWishlistItem, updateWishlistItem, deleteWishlistItem, cloneWishlistItem } = require('../controllers/wishlistController');

const router = express.Router();

router.get('/', getWishlist);
router.post('/', addWishlistItem);
router.put('/:itemId', updateWishlistItem);
router.delete('/:itemId', deleteWishlistItem);
router.post('/:itemId/clone', cloneWishlistItem);

module.exports = router;
