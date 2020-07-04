const express = require('express')
const router = express.Router()
const Joi = require('joi')
const Car = require('../models/Car')
const Model = require('../models/Model')
const filterCarModel = require('../utils/filterCarModel')
const multer = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })


router.post('/api/cars', async (req, res) => {
    try {
        const { error } = validateCar(req.body)
        if (error) { return res.status(400).json({ error: error.details[0].message }) }

        const model = await Model.findById(req.body.modelId)
        if (!model) { return res.status(400).json({ error: 'Model Not Found' }) }
        let car = new Car({
           // imageURL: 'http://localhost:5000' + '/api/images/' + req.file.filename,
            model,
            year: req.body.year,
            color: req.body.color,
            bodyType: req.body.bodyType,
            price: req.body.price,
            transmission: req.body.transmission,
            description: req.body.description,
            milage: req.body.milage,
            driveType: req.body.driveType
        })

        await car.save()

        res.send(car)
    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
})


router.get('/api/cars', async (req, res) => {
    try {
        const cars = await Car.find().sort('price')
        res.status(200).json(cars)

    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
})
///With Query
router.get('/api/cars/model/:id', async (req, res) => {
    try {
        const model = req.params.id

        const cars = await Car.find().sort('price')

        const car = filterCarModel(cars, model)
        if (!car) { return res.status(400).json({ error: 'Car Model Not Found' }) }

        res.status(200).json(car)

    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
})

router.get('/api/cars/:id', async (req, res) => {
    try {

        const car = await Car.findById(req.params.id)
        if (!car) { return res.status(400).json({ error: 'Car Not Found' }) }

        res.status(200).json(car)

    } catch (error) {
        if (error.kind === 'ObjectId') { return res.status(400).json({ error: 'Car Not Found' }) }
        res.status(500).json({ error: 'Server Error' })
    }
})



router.put('/api/cars/:id', async (req, res) => {
    try {
        const { error } = validateCar(req.body)
        if (error) { return res.status(400).json({ error: error.details[0].message }) }

        let car = await Car.findById(req.params.id)
        if (!car) { return res.status(400).json({ error: 'Car Not Found' }) }

        const model = await Model.findById(req.body.modelId)
        if (!model) { return res.status(400).json({ error: 'Model Not Found' }) }

        car = ({

            model,
            year: req.body.year,
            color: req.body.color,
            bodyType: req.body.bodyType,
            price: req.body.price,
            transmission: req.body.transmission,
            description: req.body.description,
            milage: req.body.milage,
            driveType: req.body.driveType
        })

        car = await Car.findByIdAndUpdate(req.params.id, { $set: car }, { new: true })

        res.status(200).json(car)

    } catch (error) {
        if (error.kind === 'ObjectId') { return res.status(400).json({ error: 'Car Not Found' }) }
        res.status(500).json({ error: 'Server Error' })
    }
})

router.delete('/api/cars/:id', async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id)
        if (!car) { return res.status(400).json({ error: 'Car Not Found' }) }

        res.status(200).json(car)

    } catch (error) {
        if (error.kind === 'ObjectId') { return res.status(400).json({ error: 'Car Not Found' }) }
        res.status(500).json({ error: 'Server Error' })
    }
})




function validateCar(car) {
    const schema = ({
        modelId: Joi.string(),
        bodyType: Joi.string(),
        color: Joi.string(),
        price: Joi.number(),
        transmission: Joi.string(),
        year: Joi.number(),
        description: Joi.string(),
        driveType: Joi.string(),
        milage: Joi.number()
    })
    return Joi.validate(car, schema)
}
module.exports = router