const express = require('express')
const router = express.Router()
const multer = require('multer')
const Image = require('../models/Image')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}
const upload = multer({ storage })


router.post('/api/images', upload.single('carPic'), async (req, res) => {
    try {
        let file = new Image({
            imageURL: 'http://localhost:5000' + '/uploads/' + req.file.filename
        })
        if (!file) { return res.status(400).send('File Not Found') }

        let data = await file.save()
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})

router.get('/uploads/:id', async (req, res) => {
    try {

        const img = await Image.findById(req.params.id)
        if (!img) { return res.status(400).json({ error: 'Image Not Found' }) }
        res.send(img.imageURL)
    } catch (error) {

    }
})


module.exports = router