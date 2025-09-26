const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Plant name is required'],
        trim: true
    },
    category: {
        type: String,
        enum: ['Indoor', 'Outdoor', 'Succulent', 'Flowering', 'Herb', 'Other'],
        required: [true, 'Category is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number']
    },
    description: {
        type: String,
        trim: true
    },
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Plant', PlantSchema);
