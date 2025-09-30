const AdminUser = require('./AdminUser');
const MemberUser = require('./MemberUser');

class UserFactory {
  static fromDocument(doc) {
    if (!doc) return null;
    const { _id, email, role } = doc;
    return role === 'ADMIN'
      ? new AdminUser(String(_id), email, role)
      : new MemberUser(String(_id), email, role);
  }
}

module.exports = UserFactory;
