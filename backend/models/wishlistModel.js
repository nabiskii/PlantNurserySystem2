const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  plantId: { type: String, required: true }, // just a string for demo
  quantity: { type: Number, default: 1 },
  notes: { type: String, default: '' }
});

const wishlistSchema = new mongoose.Schema({
  items: [wishlistItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
