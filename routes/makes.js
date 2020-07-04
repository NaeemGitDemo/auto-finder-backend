const express = require('express')
const Joi = require('joi')
const Make = require('../models/Make')
const router = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.post('/api/makes', [auth, admin], async (req, res) => {
    try {
        const { error } = validateMake(req.body)
        if (error) { return res.status(400).json({ error: error.details[0].message }) }

        let make = await Make.findOne({ name: req.body.name.toUpperCase() })
        if (make) { return res.status(400).json({ error: 'Make Already Exists' }) }

        make = new Make({
            name: req.body.name.toUpperCase()
        })

        await make.save()
        res.status(200).json(make)

    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
})

router.get('/api/makes', async (req, res) => {
    try {
        const makes = await Make.find().sort('name')
        res.status(200).json(makes)
    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
})

router.get('/api/makes/:id', async (req, res) => {
    try {
        const make = await Make.findById(req.params.id)
        if (!make) { return res.status(400).json({ error: 'Make Not Found' }) }

        res.status(200).json(make)

    } catch (error) {
        if (error.kind === 'ObjectId') { return res.status(400).json({ error: 'Make Not Found' }) }
        res.status(500).json({ error: 'Server Error' })
    }
})

router.put('/api/makes/:id',[auth, admin], async (req, res) => {
    try {
        const { error } = validateMake(req.body)
        if (error) { return res.status(400).json({ error: error.details[0].message }) }

        let make = await Make.findById(req.params.id)
        if (!make) { return res.status(400).json({ error: 'Make Not Found' }) }

        make.name = req.body.name.toUpperCase()
        await make.save()
        res.status(200).json(make)

    } catch (error) {
        if (error.kind === 'ObjectId') { return res.status(400).json({ error: 'Make Not Found' }) }
        res.status(500).json({ error: 'Server Error' })
    }
})


router.delete('/api/makes/:id',[auth, admin], async (req, res) => {
    try {
        
        let make = await Make.findByIdAndDelete(req.params.id)
        if (!make) { return res.status(400).json({ error: 'Make Not Found' }) }


        res.status(200).json({ message: 'Make Deleted' })

    } catch (error) {
        if (error.kind === 'ObjectId') { return res.status(400).json({ error: 'Make Not Found' }) }
        res.status(500).json({ error: 'Server Error' })
    }
})


function validateMake(make) {
    const schema = ({
        name: Joi.string().required().min(3).max(20)
    })
    return Joi.validate(make, schema)
}


module.exports = router