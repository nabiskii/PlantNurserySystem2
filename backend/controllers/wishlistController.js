const { wishlistService } = require('../services');

// helper to safely parse integers
function asInt(value, defaultValue) {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

// GET /api/wishlist
const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.findByUser(req.user.id, { user: req.user });
    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
};

// POST /api/wishlist/items
const addItem = async (req, res, next) => {
  try {
    const item = await wishlistService.addItem(req.user.id, req.body, { user: req.user });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// PUT /api/wishlist/items/:itemId
const updateItem = async (req, res, next) => {
  try {
    const updated = await wishlistService.updateItem(req.user.id, req.params.itemId, req.body, { user: req.user });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/wishlist/items/:itemId
const deleteItem = async (req, res, next) => {
  try {
    const removed = await wishlistService.removeItem(req.user.id, req.params.itemId, { user: req.user });
    res.status(200).json({ message: 'Wishlist item deleted successfully', removed });
  } catch (error) {
    next(error);
  }
};

// POST /api/wishlist/items/:itemId/clone
const cloneItem = async (req, res, next) => {
  try {
    const cloned = await wishlistService.cloneItem(req.user.id, req.params.itemId, { user: req.user });
    res.status(201).json(cloned);
  } catch (error) {
    next(error);
  }
};

// GET /api/wishlist/admin  (admin only)
const getAllWishlists = async (_req, res, next) => {
  try {
    const all = await wishlistService.findAll();
    res.status(200).json(all);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addItem,
  updateItem,
  deleteItem,
  cloneItem,
  getAllWishlists,
};
