const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  university: { type: String },
  address: { type: String },

//  add this field for role-aware authorization
  role: { type: String, enum: ['ADMIN', 'MEMBER'], default: 'MEMBER' }
});

// hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
