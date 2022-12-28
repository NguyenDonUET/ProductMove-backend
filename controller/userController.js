const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Generate Token
const generateToken = id => {
   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

const createUser = async (req, res) => {
   const { email, password, role, phone, nameRole } = req.body
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
   const userExists = await User.findOne({ email })

   if (userExists) {
      return res.status(400).json({
         msg: 'Email đã tồn tại'
      })
   }

   // Create new user
   const user = await User.create({
      email,
      password,
      role,
      phone,
      nameRole
   })

   //   Generate Token
   const token = generateToken(user._id)

   // Send HTTP-only cookie
   res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: 'none'
   })

   if (user) {
      const { _id, email, role, phone } = user
      res.status(201).json({
         _id,
         email,
         role,
         nameRole,
         phone,
         token
      })
   } else {
      res.status(400).json({
         msg: 'Invalid user'
      })
   }
}

const getUsers = asyncHandler(async (req, res) => {
   try {
      const users = await User.find({ role: { $not: { $eq: 'admin' } } })
      res.status(200).json({
         status: 'Get users success',
         data: users
      })
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
})

// Login User
const loginUser = asyncHandler(async (req, res) => {
   const { email, password } = req.body

   // Validate Request
   if (!email || !password) {
      res.status(400)
      throw new Error('Please add email and password')
   }

   // Check if user exists
   const user = await User.findOne({ email })

   if (!user) {
      res.status(400)
      throw new Error('User not found, please signup')
   }

   // User exists, check if password is correct
   const passwordIsCorrect = await bcrypt.compare(password, user.password)

   //   Generate Token
   const token = generateToken(user._id)

   // Send HTTP-only cookie
   res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400) // 1 day
   })
   if (user && passwordIsCorrect) {
      const { _id, email, role, phone } = user
      res.status(200).json({
         _id,
         email,
         role,
         phone,
         token
      })
   } else {
      res.status(400)
      throw new Error('Invalid email or password')
   }
})

// Logout User
const logout = asyncHandler(async (req, res) => {
   res.cookie('token', '', {
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
         return res.status(404).json(`No productLine with id: ${id}`)
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
   updateUser
}
