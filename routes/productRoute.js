const express = require('express')
const { faker } = require('@faker-js/faker')

const {
   getAllProducts,
   getProduct,
   createProduct,
   updateProduct,
   deleteProduct
} = require('../controller/productController')
const Product = require('../models/productModel')

const router = express.Router()
// controllers

router.get('/fake-data', async (req, res, next) => {
   const status = [
      'Mới sản xuất',
      'Đưa về đại lý',
      'Đã bán',
      'Lỗi, cần bảo hành',
      'Đang sửa chữa bảo hành',
      'Đã bảo hành xong',
      'Đã trả lại bảo hành cho khách hàng',
      'Lỗi và cần trả về nhà máy',
      'Lỗi và đã đưa về cơ sở sản xuất',
      'Lỗi cần triệu hồi',
      'Hết thời gian bảo hành',
      'Trả lại cơ sở sản xuất'
   ]
   const facotries = ['Cơ sở sản xuất Đà Nẵng', 'Cơ sở sản xuất Hà Nội']
   const agencies = ['Đại lý CellphoneS', 'Đại lý 24h Store']
   const warranties = ['Trung tâm bảo hành Apple', 'Trung tâm bảo hành Samsung']
   const capacities = ['24GB', '56GB', '4GB', '128GB']
   for (let i = 0; i < 44; i++) {
      const newprd = new Product()
      newprd.name = faker.commerce.productName()
      newprd.code = faker.address.countryCode('alpha-3') // 'TJK'
      newprd.productLine = faker.commerce.product()
      newprd.status = status[Math.floor(Math.random() * 12)] // 0 - 11
      newprd.facotry = facotries[Math.floor(Math.random() * 2)]
      newprd.agency = agencies[Math.floor(Math.random() * 2)] // 154.00
      newprd.warrantyCenter = warranties[Math.floor(Math.random() * 2)] // 154.00
      newprd.des = faker.commerce.productDescription()
      newprd.price = faker.commerce.price(1000000, 2000000, 0) // 133
      newprd.capacity = capacities[Math.floor(Math.random() * 4)]
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
      await Product.deleteMany({})
      res.status(200).json({
         status: 'deleted all data'
      })
   } catch (error) {
      res.status(500).json({
         error: error
      })
   }
})
// Get all tasks
router.get('/', getAllProducts)
router.post('/', createProduct)
router.get('/:id', getProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router
