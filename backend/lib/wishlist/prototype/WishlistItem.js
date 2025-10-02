class WishlistItem {
  constructor({ plantId, quantity, notes }) {
    this.plantId = plantId;
    this.quantity = quantity || 1;
    this.notes = notes || '';
  }

  clone() {
    return new WishlistItem({
      plantId: this.plantId,
      quantity: this.quantity,
      notes: this.notes
    });
  }
}

module.exports = WishlistItem;
