
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['member', 'admin'],
        default: 'member',
    },
    university: { 
        type: String,
    },
    address: {   
        type: String,
    },
}, {
    timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Discriminators for role-based access
const User = mongoose.model('User', UserSchema);

const AdminUser = User.discriminator('AdminUser', new mongoose.Schema({}));
const MemberUser = User.discriminator('MemberUser', new mongoose.Schema({}));

module.exports = { User, AdminUser, MemberUser };
