const User = require('./User');

class AdminUser extends User {
  can(_action) {
    // admins can do everything
    return true;
  }
}

module.exports = AdminUser;
