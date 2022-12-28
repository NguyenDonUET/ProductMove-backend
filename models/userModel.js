const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
   email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true
   },
   password: {
      type: String,
      required: [true, 'Please add password']
   },
   role: {
      type: String,
      required: true
   },
   nameRole: {
      type: String,
      required: true
   },
   phone: {
      type: String,
      required: true
   }
})
//   Encrypt password before saving to DB
userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) {
      return next()
   }
   // Hash password
   const salt = await bcrypt.genSalt(10)
   const hashedPassword = await bcrypt.hash(this.password, salt)
   this.password = hashedPassword
   next()
})

const User = mongoose.model('users', userSchema)
module.exports = User
