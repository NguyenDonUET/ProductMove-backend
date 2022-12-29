const express = require('express')
const {
   protect,
   restrictTo,
   forgotPassword,
   resetPassword
} = require('../controller/authoController')
const {
   createUser,
   loginUser,
   logout,
   getUsers,
   deleteUser,
   updateUser,
   loginStatus
} = require('../controller/userController')
const User = require('../models/userModel')

const router = express.Router()
// controllers

// Routes
router.get('/removeAll', async (req, res) => {
   try {
      await User.deleteMany({})
      res.status(200).json({
         status: 'deleted all data'
      })
   } catch (error) {
      res.status(500).json({
         error: error
      })
   }
})
router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)

router.post('/login', loginUser)
router.get('/logout', logout)

router.get('/getLogin', loginStatus)

router.post('/register', createUser)
router.get('/getUsers', getUsers)

router.delete('/:id', deleteUser)
router.patch('/:id', protect, updateUser)

module.exports = router
