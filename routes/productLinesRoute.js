const express = require('express')
const { faker } = require('@faker-js/faker')
const ProductLine = require('../models/productLineModel')
const {
   getAllProductLines,
   createProductLine,
   getProductLine,
   updateProductLine,
   deleteProductLine
} = require('../controller/productLinesController')
const router = express.Router()
// controllers

router.get('/fake-data', async (req, res) => {
   for (let i = 0; i < 44; i++) {
      const newprd = new ProductLine()
      newprd.name = faker.commerce.product()
      newprd.code = faker.address.countryCode('alpha-3') // 'TJK'
      newprd.productQuantity = faker.commerce.price(100, 200) // 154.00
      newprd.des = faker.commerce.productDescription()
      newprd.warrantyPeriod = faker.commerce.price(12, 36) // 154.00
      newprd.produceDate = faker.date.between(
         '2021-01-01T00:00:00.000Z',
         '2022-11-30T00:00:00.000Z'
      )
      newprd.save(err => {
         if (err) {
            return next(err)
         }
      })
   }
   res.send('fake success')
})

router.get('/removeAll', async (req, res) => {
   try {
      await ProductLine.deleteMany({})
      res.status(200).json({
         status: 'deleted all data'
      })
   } catch (error) {
      res.status(500).json({
         error: error
      })
   }
})

router.get('/', getAllProductLines)
router.get('/:id', getProductLine)
router.post('/', createProductLine)
router.put('/:id', updateProductLine)
router.delete('/:id', deleteProductLine)

module.exports = router
