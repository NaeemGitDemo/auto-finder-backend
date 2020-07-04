const mongoose = require('mongoose')


const modelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    make: {
        name: String,
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'makes'
        }

    }
})

const Model = mongoose.model('models', modelSchema)


module.exports = Model