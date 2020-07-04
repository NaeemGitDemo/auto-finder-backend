const express = require('express')
const router = express.Router()
const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Image = require('../models/Image')
require('dotenv').config()


const accessKey = process.env.AWS_ACCESS_KEY_ID
const secretKey = process.env.AWS_SECRET_ACCESS_KEY
AWS.config = ({
    accessKeyId: accessKey,
    secretAccessKey: secretKey
})


//imageId = "3134853242"
const s3 = new AWS.S3()
const filepath = './uploads/carPicUpload.png'


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, 'carPicUpload' + path.extname(file.originalname))
//     }
// })
const storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    shouldTransform: function (req, file, cb) {
        cb(null, 'hello')
    },
    transforms: [{
        transform: function (req, file, cb) {
            cb(null, sharp().jpg())
        }
    }],
    transforms: () => sharp().resize(500, 500),
    key: function (req, file, cb) {
        cb(null, path.basename(file.originalname) + path.extname(file.originalname))
    },

})
const upload = multer({ storage })


// const createFileToUpload = () => {
//     var params = {
//         Bucket: 'autofinder-car-images',
//         Body: fs.createReadStream(filepath),
//         ACL: 'public-read',
//         ContentType: 'image/jpeg',
//         Key: path.basename(filepath)//'CarPic_' + Date.now() + "_" + path.basename(filepath)
//     }
//     s3.upload(params, (err, data) => {
//         if (err) {
//             console.log('Error', err)
//         }
//         if (data) {
//             console.log('Uploaded in :', data.Location)

//         }
//     })
// }


router.post('/uploads', upload.single('carPic'), async (req, res) => {
    const file = req.file
    //  if (!file) { return res.status(400).json({ error: 'Please Upload File' }) }
    // const _id = req.file._id

    const img = new Image({
        // _id,
        imageURL: file.location
    })
    await img.save()
    console.log(req.file)
    res.send(file.location)

})




module.exports = router