const jwt = require('jsonwebtoken')
//const config = require('config')
require('dotenv').config()

const auth = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token')
        if (!token) { return res.status(500).json({ error: 'Missing Token' }) }

        const decoded = await jwt.verify(token, process.env.JWT_PRIVATE_KEY)
        req.user = decoded

        next()
    } catch (error) {
        res.status(403).json({ error: 'Invalid Token' })
    }
}

module.exports = auth