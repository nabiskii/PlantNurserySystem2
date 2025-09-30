// backend/middleware/attachUser.js
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const UserFactory = require('../lib/Users/UserFactory');

async function attachUser(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) return next(); // no token, skip

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userDoc = await UserModel.findById(payload.sub);

    // Factory builds AdminUser or MemberUser
    req.user = UserFactory.fromDocument(userDoc);
  } catch (err) {
    console.error('Auth error:', err.message);
  } finally {
    next();
  }
}

module.exports = attachUser;
