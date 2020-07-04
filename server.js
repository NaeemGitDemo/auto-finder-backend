const express = require('express')
const connectDB = require('./config/db')
const app = express()
const cors = require('cors')
const makes = require('./routes/makes')
const models = require('./routes/models')
const cars = require('./routes/cars')
const exps = require('./experiment/multerDemo')
const users = require('./routes/user')
const login = require('./routes/login')
const images = require('./routes/images')
const awstest = require('./routes/aws-node')
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cors())
connectDB()


app.get('/', (req, res) => {
    res.send('Car-Dealer API SERVER_From Practice Folder')
})

app.use(makes)
app.use(models)
app.use(cars)
app.use(exps)
app.use(users)
app.use(login)
app.use(images)
app.use(awstest)

app.listen(port, () => {
    console.log(`Car-Dealer Api-Server Started on port ${port}`)
})