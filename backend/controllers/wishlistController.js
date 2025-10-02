const services = require('../services'); // use services index so tests can stub

// GET /api/wishlist
const getWishlist = async (_req, res, next) => {
  try {
    const data = await services.wishlistService.getWishlist();
    res.status(200).json(data); // tests expect 200
  } catch (e) { next(e); }
};

// POST /api/wishlist
const addWishlistItem = async (req, res, next) => {
  try {
    const data = await services.wishlistService.addItem(req.body.plant);
    res.status(201).json(data); // tests expect 201
  } catch (e) { next(e); }
};

// PUT /api/wishlist/:itemId
const updateWishlistItem = async (req, res, next) => {
  try {
    const data = await services.wishlistService.updateItem(req.params.itemId, req.body);
    if (!data) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(data); // tests expect 200
  } catch (e) { next(e); }
};

// DELETE /api/wishlist/:itemId
const deleteWishlistItem = async (req, res, next) => {
  try {
    const data = await services.wishlistService.deleteItem(req.params.itemId);
    res.status(200).json(data); // tests expect 200
  } catch (e) { next(e); }
};

// POST /api/wishlist/:itemId/clone
const cloneWishlistItem = async (req, res, next) => {
  try {
    const data = await services.wishlistService.cloneItem(req.params.itemId);
    if (!data) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(data); // tests expect 200
  } catch (e) { next(e); }
};

module.exports = {
  getWishlist,
  addWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
  cloneWishlistItem,
};
