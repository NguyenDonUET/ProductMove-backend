const dotenv = require('dotenv')
const app = require('./app')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 5000
const connectDb = async () => {
   try {
      await mongoose
         .set('strictQuery', false)
         .connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
         })
         .then(res => {
            console.log('DB connected')
         })
   } catch (error) {
      console.log(error.message)
   }
}
connectDb()

app.listen(PORT, () => {
   console.log(`running on port ${PORT}`)
})

// connect to DB and start server
// mongoose
//    .set('strictQuery', false)
//    .connect(process.env.MONGO_URI)
//    .then(() => {
//       app.listen(PORT, () => {
//          console.log(`server running on port: ${PORT}`)
//       })
//    })
//    .catch(error => {
//       console.log(error)
//    })
