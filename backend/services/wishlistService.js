const Wishlist = require('../models/wishlistModel');
const InternalPlantAdapter = require('../lib/wishlist/adapters/InternalPlantAdapter');
const WishlistItem = require('../lib/wishlist/prototype/WishlistItem');
const Plant = require('../models/Plant');

const plantAdapter = new InternalPlantAdapter();

async function getWishlist(userId) {
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) wishlist = await Wishlist.create({ userId, items: [] });
  return wishlist;
}

async function addItem(userId, plant) {
  const wishlist = await getWishlist(userId);

  // If only id came, fetch full plant from DB
  if (plant && !plant.name) {
    const id = plant._id || plant.id || plant;
    if (id) {
      const fromDb = await Plant.findById(id).lean();
      if (fromDb) plant = fromDb;
    }
  }

  const normalized = plantAdapter.getSummary(plant) || {};
  console.log('[wishlist:addItem] normalized =', normalized); // DEBUG

  const existingItem = wishlist.items.find(item => item.plantId.toString() === normalized.id.toString());

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const itemData = {
      plantId: normalized.id,
      quantity: 1,
      notes: plant.notes || '',
    };
    wishlist.items.push(itemData);
  }

  return wishlist.save();
}

async function updateItem(userId, itemId, update) {
  const wishlist = await getWishlist(userId);
  const item = wishlist.items.id(itemId);
  if (!item) return null;

  Object.assign(item, update);
  return wishlist.save();
}

async function deleteItem(userId, itemId) {
  const wishlist = await getWishlist(userId);
  const it = wishlist.items.id(itemId);
  if (it) it.remove();
  return wishlist.save();
}

async function cloneItem(userId, itemId) {
  const wishlist = await getWishlist(userId);
  const item = wishlist.items.id(itemId);
  if (!item) return null;

  const clone = new WishlistItem(item.toObject()).clone();
  wishlist.items.push(clone);
  return wishlist.save();
}

module.exports = { getWishlist, addItem, updateItem, deleteItem, cloneItem };
