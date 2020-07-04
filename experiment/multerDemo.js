const express = require('express')
const router = express.Router()
const multer = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {

        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({ storage })

router.post('/api/multers', upload.single('testFile'), async (req, res) => {
    try {
        console.log(req.file)
        res.send('testing Multer')
    } catch (error) {

    }
})

module.exports = router

