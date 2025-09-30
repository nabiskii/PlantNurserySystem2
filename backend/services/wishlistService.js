const Wishlist = require('../models/wishlistModel');
const InternalPlantAdapter = require('../lib/wishlist/adapters/InternalPlantAdapter');
const WishlistItem = require('../lib/wishlist/prototype/WishlistItem');

const plantAdapter = new InternalPlantAdapter();

async function getWishlist() {
  let wishlist = await Wishlist.findOne();
  if (!wishlist) wishlist = await Wishlist.create({ items: [] });
  return wishlist;
}

async function addItem(plant) {
  const wishlist = await getWishlist();
  const normalized = plantAdapter.getSummary(plant);

  const item = new WishlistItem({ plantId: normalized.id, quantity: 1 });
  wishlist.items.push(item);
  return wishlist.save();
}

async function updateItem(itemId, update) {
  const wishlist = await getWishlist();
  const item = wishlist.items.id(itemId);
  if (!item) return null;

  Object.assign(item, update);
  return wishlist.save();
}

async function deleteItem(itemId) {
  const wishlist = await getWishlist();
  wishlist.items.id(itemId)?.remove();
  return wishlist.save();
}

async function cloneItem(itemId) {
  const wishlist = await getWishlist();
  const item = wishlist.items.id(itemId);
  if (!item) return null;

  const clone = new WishlistItem(item.toObject()).clone();
  wishlist.items.push(clone);
  return wishlist.save();
}

module.exports = { getWishlist, addItem, updateItem, deleteItem, cloneItem };
