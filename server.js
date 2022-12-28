const dotenv = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const errorHandler = require('./middleware/errorMiddleware')
const userRoute = require('./routes/userRoute')
const productLineRoutes = require('./routes/productLinesRoute')
const productRoute = require('./routes/productRoute')

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

// Error middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

// connect to DB and start server
mongoose
   .set('strictQuery', false)
   .connect(process.env.MONGO_URI)
   .then(() => {
      app.listen(PORT, () => {
         console.log(`server running on port: ${PORT}`)
      })
   })
   .catch(error => {
      console.log(error)
   })
