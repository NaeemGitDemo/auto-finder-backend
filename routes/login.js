const express = require('express')
const router = express.Router()
const Joi = require('joi')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const User = require('../models/User')
const generateToken = require('../utils/genrateToken')


router.post('/api/login', async (req, res) => {
    try {
        const { error } = validateLogin(req.body)
        if (error) { return res.status(401).json({ error: error.details[0].message }) }

        let user = await User.findOne({ email: req.body.email })
        if (!user) { return res.status(401).json({ error: 'Invalid Email or Password' }) }

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) { return res.status(401).json({ error: 'Invalid Email or Password' }) }

        const token = await generateToken(user)
        const data = _.pick(user, ['name', 'email', '_id'])
        res
            .status(200)
            .header('x-auth-token', token)
            .header('access-control-expose-headers', 'x-auth-token')
            .json(data)

    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
})





function validateLogin(log) {
    const schema = ({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
    return Joi.validate(log, schema)
}
module.exports = router