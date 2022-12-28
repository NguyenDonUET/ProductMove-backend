const mongoose = require('mongoose')

const productLineSchema = mongoose.Schema({
   code: {
      type: String,
      required: true
   },
   name: {
      type: String,

      required: [true, 'Please add a name product line']
   },
   productQuantity: {
      type: Number,
      required: false,
      default: 0
   },
   des: {
      type: String,
      required: false,
      default: ''
   },
   warrantyPeriod: {
      type: Number,
      required: false,
      default: 0
   },
   produceDate: {
      type: Date,
      required: false,
      default: new Date()
   }
})
const ProductLine = mongoose.model('ProductLines', productLineSchema)
module.exports = ProductLine
