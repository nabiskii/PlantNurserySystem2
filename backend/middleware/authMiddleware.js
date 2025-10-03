const jwt = require('jsonwebtoken');
const { User } = require('../models/User'); 
const UserFactory = require('../lib/auth/UserFactory'); 

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userDoc = await User.findById(decoded.id).select('-password');

      if (!userDoc) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = UserFactory.createUser(userDoc);

      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = { protect };
