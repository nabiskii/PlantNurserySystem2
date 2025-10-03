// middleware/protect.js
const jwt = require('jsonwebtoken');
const { User } = require('../models/User'); // Import User model
const UserFactory = require('../lib/auth/UserFactory'); // Import UserFactory

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the raw user document
      const userDoc = await User.findById(decoded.id).select('-password');

      if (!userDoc) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Use the UserFactory to create a role-aware user object
      req.user = UserFactory.createUser(userDoc);

      return next();
    } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = { protect };
