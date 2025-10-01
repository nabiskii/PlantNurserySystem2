const mongoose = require('mongoose');

const WishlistItemSchema = new mongoose.Schema(
  {
    plantId: { type: mongoose.Schema.Types.Mixed, required: true },

    // Snapshot fields for UI
    name: { type: String },
    category: { type: String },
    price: { type: Number },
    stockQuantity: { type: Number },
    description: { type: String },

    // Wishlist-specific
    quantity: { type: Number, default: 1 },
  },
  { _id: true }
);

const WishlistSchema = new mongoose.Schema(
  { items: [WishlistItemSchema] },
  { timestamps: true }
);

module.exports = mongoose.model('Wishlist', WishlistSchema);
