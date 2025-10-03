
const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password, role, university, address } = req.body; // Include role, university, address
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, role, university, address }); // Pass role, university, address
        res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role, university: user.university, address: user.address, token: generateToken(user.id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ id: user.id, name: user.name, email: user.email, role: user.role, university: user.university, address: user.address, token: generateToken(user.id) });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Error during login:", error); // Keep error logging
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
      // req.user is already a role-aware object from UserFactory
      // We can directly use req.user's properties
      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        university: req.user.userDoc.university, // Access from userDoc
        address: req.user.userDoc.address,     // Access from userDoc
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

const updateUserProfile = async (req, res) => {
    try {
        // Fetch the raw user document for update
        const userDoc = await User.findById(req.user.id);
        if (!userDoc) return res.status(404).json({ message: 'User not found' });

        const { name, email, role, university, address } = req.body;

        // Update fields only if they are explicitly provided in the request body
        if (name !== undefined) userDoc.name = name;
        if (email !== undefined) userDoc.email = email;
        if (role !== undefined) userDoc.role = role;
        if (university !== undefined) userDoc.university = university;
        if (address !== undefined) userDoc.address = address;

        const updatedUserDoc = await userDoc.save();

        // Return the updated user details, including role, university, address
        res.json({
            id: updatedUserDoc.id,
            name: updatedUserDoc.name,
            email: updatedUserDoc.email,
            role: updatedUserDoc.role,
            university: updatedUserDoc.university,
            address: updatedUserDoc.address,
            token: generateToken(updatedUserDoc.id)
        });
    } catch (error) {
        console.error("Error updating user profile:", error); // Log the full error
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };
