const dotenv = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const userRoute = require('./routes/userRoute')
const productLineRoutes = require('./routes/productLinesRoute')
const productRoute = require('./routes/productRoute')
const globalErrorHandler = require('./controller/errorController')

const app = express()
// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// Routes
app.get('/', (req, res) => {
   res.end('Home page')
})
app.use('/api/user', userRoute)
app.use('/api/productLines', productLineRoutes)
app.use('/api/products', productRoute)

app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(globalErrorHandler)
module.exports = app
