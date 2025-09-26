const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Employee name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    role: {
        type: String,
        enum: ['Admin', 'Staff', 'Manager', 'Other'],
        required: [true, 'Role is required']
    },
    phone: {
        type: String,
        trim: true
    },
    department: {
        type: String,
        trim: true
    },
    dateJoined: {
        type: Date,
        default: Date.now
    }
}, 
{
    timestamps: true
});

module.exports = mongoose.model('Employee', EmployeeSchema);
