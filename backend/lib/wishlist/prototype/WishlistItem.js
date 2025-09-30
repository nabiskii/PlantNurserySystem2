// backend/lib/wishlist/prototype/WishlistItem.js

// Prototype class representing a wishlist item
class WishlistItem {
  constructor({ plantId, name, quantity = 1, notes, meta }) {
    this.plantId = plantId;
    this.name = name;
    this.quantity = quantity;
    this.notes = notes;
    this.meta = meta || undefined;
  }

  // Prototype Pattern → clone this item with optional overrides
  clone(overrides = {}) {
    return new WishlistItem({
      plantId: overrides.plantId ?? this.plantId,
      name: overrides.name ?? this.name,
      quantity: overrides.quantity ?? this.quantity,
      notes: overrides.notes ?? this.notes,
      meta: overrides.meta ?? (this.meta ? JSON.parse(JSON.stringify(this.meta)) : undefined),
    });
  }
}

module.exports = WishlistItem;
