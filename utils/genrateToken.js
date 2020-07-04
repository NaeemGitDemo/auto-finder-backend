const jwt = require('jsonwebtoken')
//const config = require('config')
require('dotenv').config()

const generateToken = async (user) => {
    try {
        const token = jwt.sign({ _id: user._id, name: user.name, isAdmin: user.isAdmin }, process.env.JWT_PRIVATE_KEY)
        return token
    } catch (error) {
        return error
    }
}


module.exports = generateToken