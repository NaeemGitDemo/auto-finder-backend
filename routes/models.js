const express = require('express')
const Joi = require('joi')
const router = express.Router()
const Model = require('../models/Model')
const Make = require('../models/Make')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.post('/api/models', [auth, admin], async (req, res) => {
    try {
        const { error } = validateModels(req.body)
        if (error) { return res.status(400).json({ error: error.details[0].message }) }

        const make = await Make.findById(req.body.makeId)
        if (!make) { return res.status(400).json({ error: 'Make Not Found' }) }

        let model = await Model.findOne({ name: req.body.name })
        if (model) { return res.status(400).json({ error: 'Model Already Exists' }) }

        model = new Model({
            name: req.body.name,
            make: {
                name: make.name,
                _id: make._id
            }
        })
        await model.save()
        res.status(200).json(model)

    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
})

router.get('/api/models', async (req, res) => {
    try {
        const models = await Model.find().sort('name')
        res.status(200).json(models)

    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
})

router.get('/api/models/:id', async (req, res) => {
    try {
        const model = await Model.findById(req.params.id)
        if (!model) { return res.status(400).json({ error: 'Model Not Found' }) }

        res.status(200).json(model)

    } catch (error) {
        if (error.kind === 'ObjectId') { return res.status(400).json({ error: 'Model Not Found' }) }
        res.status(500).json({ error: 'Server Error' })
    }
})

router.put('/api/models/:id', [auth, admin], async (req, res) => {
    try {
        const { error } = validateModels(req.body)
        if (error) { return res.status(400).json({ error: error.details[0].message }) }

        const make = await Make.findById(req.body.makeId)
        if (!make) { return res.status(400).json({ error: 'Make Not Found' }) }

        let model = await Model.findById(req.params.id)
        if (!model) { return res.status(400), json({ error: 'Model Not Found' }) }

        model = {
            name: req.body.name,
            make: {
                name: make.name,
                _id: make._id
            }
        }

        model = await Model.findByIdAndUpdate(req.params.id, { $set: model }, { new: true })
        await model.save()

        res.status(200).json(model)
    } catch (error) {
        if (error.kind === 'ObjectId') { return res.status(400).json({ error: 'Model Not Found' }) }
        res.status(500).json({ error: 'Server Error' })
    }

})

router.delete('/api/models/:id', [auth, admin], async (req, res) => {
    try {
        const model = await Model.findByIdAndDelete(req.params.id)
        if (!model) { return res.status(400).json({ error: 'Model Not Found' }) }
        res.status(200).json({ message: 'Model Deleted' })

    } catch (error) {
        if (error.kind === 'ObjectId') { return res.status(400).json({ error: 'Model Not Found' }) }
        res.status(500).json({ error: 'Server Error' })
    }
})



function validateModels(model) {
    const schema = ({
        name: Joi.string().required(),
        makeId: Joi.string()
    })
    return Joi.validate(model, schema)
}
module.exports = router