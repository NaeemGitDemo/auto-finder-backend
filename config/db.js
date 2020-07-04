const mongoose = require('mongoose')
const config = require('config')
//const db = config.get('dbURL')
require('dotenv').config()
const db = process.env.DB_URL


const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
        console.log('Car-Dealer Database Connected...')
    } catch (error) {
        console.log('Car-Dealer Database Error...')
        process.exit(1)
    }
}

module.exports = connectDB