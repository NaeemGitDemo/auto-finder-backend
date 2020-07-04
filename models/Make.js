const mongoose = require('mongoose')


const makeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    }
})

const Make = mongoose.model('makes', makeSchema)




module.exports = Make
