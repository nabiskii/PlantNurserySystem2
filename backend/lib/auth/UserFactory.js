class BaseUser {
    constructor(userDoc) {
        this.userDoc = userDoc;
    }

    get id() {
        return this.userDoc._id;
    }

    get name() {
        return this.userDoc.name;
    }

    get email() {
        return this.userDoc.email;
    }

    get role() {
        return this.userDoc.role;
    }

    isAdmin() {
        return this.userDoc.role === 'admin';
    }

    isMember() {
        return this.userDoc.role === 'member';
    }

    // You can add more common methods here
}

class AdminUser extends BaseUser {
    constructor(userDoc) {
        super(userDoc);
    }

    // Add admin-specific methods here if needed
    canEditDb() {
        return true;
    }
}

class MemberUser extends BaseUser {
    constructor(userDoc) {
        super(userDoc);
    }

    // Add member-specific methods here if needed
    canEditDb() {
        return false;
    }
}

class UserFactory {
    static createUser(userDoc) {
        if (!userDoc || !userDoc.role) {
            throw new Error('Invalid user document provided to UserFactory');
        }

        switch (userDoc.role) {
            case 'admin':
                return new AdminUser(userDoc);
            case 'member':
                return new MemberUser(userDoc);
            default:
                throw new Error(`Unknown user role: ${userDoc.role}`);
        }
    }
}

module.exports = UserFactory;