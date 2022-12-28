const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
   code: {
      type: String,
      required: true
   },
   name: {
      type: String,
      required: [true, 'Please add a name of product']
   },

   productLine: {
      type: String,
      required: [true, 'Please add a name of productLine']
   },
   status: {
      type: String,
      required: true
   },
   facotry: {
      type: String,
      required: true
   },
   agency: {
      type: String,
      required: true
   },
   warrantyCenter: {
      type: String,
      required: true
   },

   des: {
      type: String,
      required: true
   },
   img: {
      type: String,
      required: false,
      default: ''
   },
   price: {
      type: Number,
      required: true
   },
   capacity: {
      type: String,
      required: true
   },
   produceDate: {
      type: Date,
      required: false,
      default: new Date()
   }
})
const Product = mongoose.model('Products', productSchema)
module.exports = Product
