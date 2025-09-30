const mongoose = require('mongoose');


const WishlistItemSchema = new mongoose.Schema({
plantId: { type: String, required: true },
name: { type: String, required: true },
quantity: { type: Number, default: 1, min: 1 },
notes: { type: String },
meta: { type: mongoose.Schema.Types.Mixed }, // normalized by Adapter
}, { _id: true });


const WishlistSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
items: { type: [WishlistItemSchema], default: [] },
}, { timestamps: true });


module.exports = mongoose.model('Wishlist', WishlistSchema);