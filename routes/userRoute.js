const express = require('express')
const {
   createUser,
   loginUser,
   logout,
   getUsers,
   deleteUser,
   updateUser
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

router.get('/getUsers', getUsers)
router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/logout', logout)
router.delete('/:id', deleteUser)
router.patch('/:id', updateUser)

module.exports = router
