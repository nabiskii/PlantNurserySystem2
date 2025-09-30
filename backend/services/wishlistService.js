const Wishlist = require('../models/wishlistModel');
const WishlistItem = require('../lib/wishlist/prototype/WishlistItem');

// ✅ Correct paths (case-sensitive) to your adapters
const InternalPlantAdapter = require('../lib/wishlist/adapters/InternalPlantAdapter');
const ExternalPlantAdapter = require('../lib/wishlist/adapters/ExternalPlantAdapter');

// choose adapter per request
function selectAdapter(source) {
  if (source === 'external') {
    return new ExternalPlantAdapter(process.env.EXTERNAL_PLANT_API);
  }
  return new InternalPlantAdapter();
}

async function getOrCreate(userId) {
  let wl = await Wishlist.findOne({ userId });
  if (!wl) wl = await Wishlist.create({ userId, items: [] });
  return wl;
}

const wishlistService = {
  // GET by user (creates empty list if missing)
  async findByUser(userId) {
    return getOrCreate(userId);
  },

  // POST add item — ADAPTER pattern
  async addItem(userId, { plantId, quantity = 1, notes, source = 'internal' }) {
    const adapter = selectAdapter(source);
    const summary = await adapter.getSummary(plantId); // ← ADAPTER normalizes

    const wl = await getOrCreate(userId);
    const newItem = new WishlistItem({
      plantId: summary.id,
      name: summary.name,
      quantity: Number(quantity) || 1,
      notes,
      meta: summary.meta,
    });

    wl.items.push(newItem);
    await wl.save();
    return wl;
  },

  // PUT update item — PROTOTYPE pattern
  async updateItem(userId, itemId, patch) {
    const wl = await getOrCreate(userId);
    const current = wl.items.id(itemId);
    if (!current) throw new Error('Item not found');

    // Clone existing object and apply overrides
    const cloned = new WishlistItem(current.toObject()).clone(patch); // ← PROTOTYPE
    current.set(cloned); // replace subdoc data
    await wl.save();
    return current;
  },

  // DELETE item
  async removeItem(userId, itemId) {
    const wl = await getOrCreate(userId);
    const it = wl.items.id(itemId);
    if (!it) throw new Error('Item not found');
    it.remove();
    await wl.save();
    return { removed: 1 };
  },

  // POST clone item — PROTOTYPE pattern
  async cloneItem(userId, itemId, overrides = {}) {
    const wl = await getOrCreate(userId);
    const src = wl.items.id(itemId);
    if (!src) throw new Error('Item not found');

    const cloned = new WishlistItem(src.toObject()).clone(overrides); // ← PROTOTYPE
    wl.items.push(cloned);
    await wl.save();
    return cloned;
  },

  // ADMIN
  async findAll() {
    return Wishlist.find().populate('userId', 'email role');
  },
};

module.exports = wishlistService;
