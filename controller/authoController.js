const User = require('../models/userModel')
const AppError = require('../utils/appError')
const { catchAsync } = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const { sendEmail } = require('../utils/email')
const crypto = require('crypto')

const protect = catchAsync(async (req, res, next) => {
   // 1. Kiểm tra token có tồn tại hay ko
   let token
   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
   ) {
      token = req.headers.authorization.split(' ')[1]
   }
   if (!token) {
      console.log('do not exits')
      return next(
         new AppError('You are not logged in! please login to get access', 401)
      )
   }
   //   2> Xác minh token
   const decode = await jwt.verify(token, process.env.JWT_SECRET)
   //   3> Check if user vẫn tồn tại
   const currentUser = await User.findById(decode.id)
   if (!currentUser) {
      return next(new AppError('Token does no longer exits.', 401))
   }
   // 4> Check if user changed password after the token was issued
   if (currentUser.changedPasswordAfter(decode.iat)) {
      return next(
         new AppError('User recently changed password! please login again', 401)
      )
   }
   req.user = currentUser
   next()
})
// phân quyền user
const restrictTo = (...roles) => {
   return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
         return next(
            new AppError(
               'You do not have permission to perform this action',
               403
            )
         )
      }
      next()
   }
}

const forgotPassword = catchAsync(async (req, res, next) => {
   // 1. Get user based on Posted email
   const user = await User.findOne({ email: req.body.email })

   if (!user) {
      return next(new AppError('There is no user with email address', 404))
   }
   // 2. Generate random token
   const resetToken = user.createPasswordResetToken()

   await user.save({ validateBeforeSave: false })
   // 3. Send it to user's email
   const resetURL = `${req.protocol}://${req.get(
      'host'
   )}/api/v1/users/resetPassword/${resetToken}`

   const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`
   try {
      await sendEmail({
         email: user.email,
         subject: 'Your password reset token (valid for 10 min)',
         message
      })

      res.status(200).json({
         status: 'success',
         message: 'Token sent to email!'
      })
   } catch (err) {
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined
      await user.save({ validateBeforeSave: false })

      return next(
         new AppError('There was an error sending the email. Try again later!'),
         500
      )
   }
})

const resetPassword = catchAsync(async (req, res, next) => {
   // 1) Get user based on the token
   const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex')

   const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
   })

   // 2) If token has not expired, and there is user, set the new password
   if (!user) {
      console.log('here')
      return next(new AppError('Token is invalid or has expired', 400))
   }
   user.password = req.body.password
   user.passwordConfirm = req.body.passwordConfirm
   user.passwordResetToken = undefined
   user.passwordResetExpires = undefined
   await user.save()

   // 3) Update changedPasswordAt property for the user
   // 4) Log the user in, send JWT
   const token = signToken(user._id)
   res.status(201).json({
      status: 'success',
      token
   })
})

module.exports = {
   protect,
   restrictTo,
   forgotPassword,
   resetPassword
}
