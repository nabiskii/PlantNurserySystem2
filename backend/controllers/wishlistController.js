const wishlistService = require('../services/wishlistService');

const getWishlist = async (_req, res, next) => {
  try {
    const data = await wishlistService.getWishlist();
    res.json(data);
  } catch (e) { next(e); }
};

const addWishlistItem = async (req, res, next) => {
  try {
    const data = await wishlistService.addItem(req.body.plant);
    res.status(201).json(data);
  } catch (e) { next(e); }
};

const updateWishlistItem = async (req, res, next) => {
  try {
    const data = await wishlistService.updateItem(req.params.itemId, req.body);
    if (!data) return res.status(404).json({ message: 'Item not found' });
    res.json(data);
  } catch (e) { next(e); }
};

const deleteWishlistItem = async (req, res, next) => {
  try {
    const data = await wishlistService.deleteItem(req.params.itemId);
    res.json(data);
  } catch (e) { next(e); }
};

const cloneWishlistItem = async (req, res, next) => {
  try {
    const data = await wishlistService.cloneItem(req.params.itemId);
    if (!data) return res.status(404).json({ message: 'Item not found' });
    res.json(data);
  } catch (e) { next(e); }
};

module.exports = { getWishlist, addWishlistItem, updateWishlistItem, deleteWishlistItem, cloneWishlistItem };
