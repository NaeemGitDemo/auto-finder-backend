const mongoose = require('mongoose')


const carSchema = new mongoose.Schema({
    //_id: { type: String },
    year: { type: Number, required: true },
    imageURL: {
        type: String,
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'images'
        }
    },

    model: {
        make: {
            name: { type: String },
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'makes'
            }
        },
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'models'
        },
        name: { type: String }
    },

    color: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    milage: { type: Number, required: true },
    driveType: { type: String },
    transmission: { type: String, required: true },
    bodyType: { type: String, required: true },
    description: { type: String },
    userId: { type: String },
    userName: { type: String }
})


const Car = mongoose.model('cars', carSchema)

module.exports = Car