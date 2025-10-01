const Wishlist = require('../models/wishlistModel');
const InternalPlantAdapter = require('../lib/wishlist/adapters/InternalPlantAdapter');
const WishlistItem = require('../lib/wishlist/prototype/WishlistItem');
const Plant = require('../models/Plant');

const plantAdapter = new InternalPlantAdapter();

async function getWishlist() {
  let wishlist = await Wishlist.findOne();
  if (!wishlist) wishlist = await Wishlist.create({ items: [] });
  return wishlist;
}

async function addItem(plant) {
  const wishlist = await getWishlist();

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

  const item = new WishlistItem({
    plantId: normalized.id,
    quantity: 1,
    name: normalized.name,
    category: normalized.category,
    price: normalized.price,
    stockQuantity: normalized.stockQuantity,
    description: normalized.description,
  });

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
  const it = wishlist.items.id(itemId);
  if (it) it.remove();
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
