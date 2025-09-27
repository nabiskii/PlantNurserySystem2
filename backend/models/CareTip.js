const mongoose = require('mongoose');

const CareTipSchema = new mongoose.Schema({
    plantId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Plant', 
        required: true, 
        index: true 
    },
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    content: { 
        type: String, 
        required: true 
    },  
    tags: { 
        type: [String], 
        default: [] 
    }, 
    difficulty: { 
        type: String, 
        enum: ['easy','moderate','advanced'], 
        default: 'easy' 
    },
}, 
{ 
    timestamps: true 
});

module.exports = mongoose.model('CareTip', CareTipSchema);
