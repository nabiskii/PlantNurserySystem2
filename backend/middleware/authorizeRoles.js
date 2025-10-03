const authorizeRoles = (allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, no user object' });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden, insufficient privileges' });
    }

    next();
};

module.exports = authorizeRoles;