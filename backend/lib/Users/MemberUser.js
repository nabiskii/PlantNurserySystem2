const User = require('./User');

class MemberUser extends User {
  can(action) {
    // allow only self-wishlist actions for members
    return ['wishlist:read:self', 'wishlist:write:self'].includes(action);
  }
}

module.exports = MemberUser;
