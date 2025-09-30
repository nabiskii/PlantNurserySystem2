class User {
  constructor(id, email, role) {
    this.id = id;
    this.email = email;
    this.role = role;
  }

  isAdmin() {
    return this.role === 'ADMIN';
  }

  // generic permissions — override in subclasses
  can(action) {
    return false;
  }
}

module.exports = User;
