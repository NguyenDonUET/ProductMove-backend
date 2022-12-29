const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const AppError = require('../utils/appError')

const userSchema = mongoose.Schema({
   email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true
   },
   password: {
      type: String,
      required: [true, 'Please add password'],
      select: false
   },
   role: {
      type: String,
      enum: ['admin', 'factory', 'agency', 'warranty center'],
      required: true
   },
   nameRole: {
      type: String,
      required: true
   },
   phone: {
      type: String,
      required: true
   },
   passwordChangedAt: Date,
   passwordResetToken: String,
   passwordResetExpires: Date,
   active: {
      type: Boolean,
      default: true,
      select: false
   }
})
//   Encrypt password before saving to DB
userSchema.pre('save', async function (next) {
   // Only run this function if password was actually modified
   if (!this.isModified('password')) return next()

   // Hash the password with cost of 12
   this.password = await bcrypt.hash(this.password, 12)

   // Delete passwordConfirm field
   this.passwordConfirm = undefined
   next()
})

userSchema.pre('save', function (next) {
   if (!this.isModified('password') || this.isNew) return next()

   this.passwordChangedAt = Date.now() - 1000
   next()
})

// userSchema.pre(/^find/, function (next) {
//    // this points to the current query
//    this.find({ active: { $ne: false } });
//    next();
//  });

// Giải mã mật khẩu và so sánh password khi login
userSchema.methods.correctPassword = async function (
   candidatePassword,
   userPassword
) {
   return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
   if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
         this.passwordChangedAt.getTime() / 1000,
         10
      )

      return JWTTimestamp < changedTimestamp
   }

   // False means NOT changed
   return false
}

userSchema.methods.createPasswordResetToken = function () {
   const resetToken = crypto.randomBytes(32).toString('hex')

   this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

   console.log({ resetToken }, this.passwordResetToken)
   // chỉ có 10p để reset
   this.passwordResetExpires = Date.now() + 10 * 60 * 1000

   return resetToken
}

const User = mongoose.model('users', userSchema)
module.exports = User
