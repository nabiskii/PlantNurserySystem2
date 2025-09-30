const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// Use 'sub' in the payload so attachUser can read payload.sub.
// Also include 'id' for backward-compat if any code still reads payload.id.
const signToken = (user) => {
  const uid = String(user._id || user.id);
  return jwt.sign(
    { sub: uid, id: uid, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    // Role: default to MEMBER; do NOT allow clients to self-assign ADMIN here
    const user = await User.create({ name, email, password, role: 'MEMBER' });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: signToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    // If you added userSchema.methods.comparePassword, you can use that instead:
    // const ok = await user.comparePassword(password);
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: signToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    // attachUser should set req.user; if you store only the token,
    // you can also decode and use payload.sub. Here we fetch by req.user.id.
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      name: user.name,
      email: user.email,
      university: user.university,
      address: user.address,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, university, address, password } = req.body;

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.university = university ?? user.university;
    user.address = address ?? user.address;

    // Optional: allow password change if provided
    if (password && password.trim()) {
      // userSchema.pre('save') with bcryptjs will hash this automatically
      user.password = password.trim();
    }

    const updated = await user.save();

    res.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      university: updated.university,
      address: updated.address,
      role: updated.role,
      token: signToken(updated), // new token reflects any email/role change
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };
