const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Joi = require('joi')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const generateToken = require('../utils/genrateToken')
const auth = require('../middleware/auth')


router.post('/api/users', async (req, res) => {
    try {
        const { error } = validateUser(req.body)
        if (error) { return res.status(400).json({ error: error.details[0].message }) }

        let user = await User.findOne({ email: req.body.email })
        if (user) { return res.status(400).json({ error: 'Email Already Registered' }) }


        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,

        })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        const token = await generateToken(user)
        await user.save()

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

router.get('/api/users/me', [auth], async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) { return res.status(400).json({ error: 'User Not Found' }) }

        const data = _.pick(user, ['name', '_id', 'email', 'date'])
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
})

router.put('/api/users/me', [auth], async (req, res) => {
    try {

        let user = await User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
        if (!user) { return res.status(400).json({ error: "User Not Found" }) }

        await user.save()
        res.status(200).json({ message: "User Updated Successfully" })

    } catch (error) {
        res.status(500).json({ error: 'Server Error', error })
    }
})


router.put('/api/users/me/password', [auth], async (req, res) => {
    try {
        console.log(req.body)
        let user = await User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
        if (!user) { return res.status(400).json({ error: "User Not Found" }) }

        console.log(user.password)
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        await user.save()
        res.status(200).json({ message: "Password Updated Successfully" })

    } catch (error) {
        res.status(500).json({ error: 'Server Error', error })
    }
})




function validateUser(user) {
    const schema = ({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required()
    })
    return Joi.validate(user, schema)
}
module.exports = router