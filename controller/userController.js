const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { catchAsync } = require('../utils/catchAsync')
const AppError = require('../utils/appError')

// Generate Token
const signToken = id => {
   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

const createSendToken = (user, statusCode, res) => {
   const token = signToken(user._id)
   const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
   const cookieOptions = {
      expires: expiryDate,
      httpOnly: true
   }
   if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

   res.cookie('jwt', token, cookieOptions)

   // Remove password from output
   user.password = undefined

   res.status(statusCode).json({
      status: 'success',
      token,
      data: {
         user
      }
   })
}

// signup
const createUser = catchAsync(async (req, res) => {
   const { email, password, role, phone, nameRole, passwordChangedAt } =
      req.body
   // Validation
   if (!email || !password || !role || !phone) {
      return res.status(400).json({
         msg: 'Vui lòng nhập đầy đủ thông tin'
      })
   }
   if (password.length < 6) {
      return res.status(400).json({
         msg: 'Mật khẩu phải lớn hơn 6 ký tự'
      })
   }
   // Check if user email already exists
   // const userExists = await User.findOne({ email })

   // if (userExists) {
   //    return res.status(400).json({
   //       msg: 'Email đã tồn tại'
   //    })
   // }

   // Create new user
   const user = await User.create({
      email,
      password,
      role,
      phone,
      nameRole,
      passwordChangedAt
   })
   // console.log(user)
   //   Generate Token
   createSendToken(user, 201, res)
})

const getUsers = catchAsync(async (req, res) => {
   try {
      const users = await User.find({ role: { $not: { $eq: '' } } })
      res.status(200).json({
         status: 'Get users success',
         data: users
      })
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
})

// Login User
const loginUser = catchAsync(async (req, res, next) => {
   const { email, password } = req.body
   console.log(req.body)
   // 1> Check if email and password exits
   if (!email || !password) {
      next(new AppError('please provide email and password', 400))
   }
   // 2> Nếu user tồn tại và password đúng, lấy thêm password về
   const user = await User.findOne({ email }).select('+password')
   if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401))
   }
   // 3> Gửi token cho client
   createSendToken(user, 200, res)
})

// Get Login Status: đã được login hay chưa
const loginStatus = asyncHandler(async (req, res) => {
   const token = req.cookies.token
   if (!token) {
      return res.json(false)
   }
   // Verify Token
   const verified = jwt.verify(token, process.env.JWT_SECRET)
   if (verified) {
      return res.json(true)
   }
   return res.json(false)
})

// Logout User
const logout = asyncHandler(async (req, res) => {
   res.cookie('jwt', '', {
      path: '/',
      httpOnly: true,
      expires: new Date(0),
      sameSite: 'none',
      secure: true
   })

   return res.status(200).json({ message: 'Successfully Logged Out' })
})

const deleteUser = asyncHandler(async (req, res) => {
   try {
      const user = await User.findByIdAndDelete(req.params.id)
      res.status(200).json({
         status: 'Delete user success',
         data: user
      })
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
})

const updateUser = async (req, res) => {
   try {
      console.log(req.body)
      const user = await User.findByIdAndUpdate(
         {
            _id: req.params.id
         },
         req.body,
         {
            new: true,
            runValidators: true
         }
      )
      if (!user) {
         return res.status(404).json(`No user with id: ${id}`)
      }
      res.status(200).json({
         status: 'update success',
         data: user
      })
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

module.exports = {
   createUser,
   loginUser,
   logout,
   getUsers,
   deleteUser,
   updateUser,
   loginStatus
}
