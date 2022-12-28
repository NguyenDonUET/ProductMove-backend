const express = require('express')
const { faker } = require('@faker-js/faker')

const {
   getAllProducts,
   getProduct,
   createProduct,
   updateProduct,
   deleteProduct,
   getFilterProducts
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
   const images = [
      'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/p/h/photo_2022-09-28_21-58-51.jpg',
      'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/1/4/14_1_9_2_9.jpg',
      'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/p/h/photo_2022-09-28_21-58-51_2.jpg',
      'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/t/_/t_m_12.png'
   ]
   const des = [
      `Chuẩn nét từng khung hình - Trang bị màn hình LCD 6.56 inch với độ phân giải HD
      Hiệu năng cải tiến, bứt phá tốc độ - Chip Helio G35, RAM 4GB và bộ nhớ trong 64GB
      Trọn vẹn năng lượng suốt cả ngày - Viên pin lớn 5000 mAh, sạc 10W
      Bảo mật nâng cao với mở khoá vân tay cạnh viền, mở khoá khuôn mặt`,
      `Hiệu năng vượt trội, xử lí ổn định mọi tác vụ - Chip Snapdragon 680 4G (6 nm) mạnh mẽ, RAM 6GB
      Không gian hiển thị mượt mà, sống động - Màn hình "chấm O" 6.56", 90Hz, đồ họa chuyển động trơn tru
      Trở thành tâm điểm của mọi bức hình - Cụm camera kép 13 MP, hỗ trợ chụp ảnh Ai, Bokeh hiệu quả
      Giải trí thả ga cả ngày dài - Viên pin lớn 5.000mAh, sạc siêu nhanh 33W`,
      `Ngất ngây trước vẻ đẹp tinh tế và cuốn hút - Thiết kế khung viền bo cong, mặt lưng chuyển màu sang trọng
      Không gian hiển thị rõ nét - Màn hình IPS LCD 6.59 inch, độ phân giải Full HD+, 90 Hz mượt mà
      Camera chuyên nghiệp, bắt trọn mọi khoảnh khắc - Cụm camera kép 50M + 2MP kèm nhiều tính năng tiện ích
      Chiến game không lắng lo - Chip Snapdragon 680 8 nhân cho hiệu suất tuyệt vời hơn, pin 5000mAh`,
      `
      Không bỏ lỡ bất kỳ khoảnh khắc - Quay video hiển thị kép cả camera trước và sau
      Trải nghiệm hình ảnh sắc nét, hiệu suất mượt mà - Helio P95 8 nhân, NPU tốc độ cao hỗ trợ AI, RAM 8GB
      Sẵn sàng để sử dụng - Pin lớn 4310mAh, sạc nhanh 30W
      Trải nghiệm thị giá mượt mà - Màn hình AMOLED 6.43 inch, mở khóa vân tay trong màn hình, chế độ bảo vệ mắt AI`,
      `Hiệu năng vượt trội, xử lí ổn định mọi tác vụ - Chip Snapdragon 680 4G (6 nm) mạnh mẽ, RAM 6GB
      Không gian hiển thị mượt mà, sống động - Màn hình "chấm O" 6.56", 90Hz, đồ họa chuyển động trơn tru
      Trở thành tâm điểm của mọi bức hình - Cụm camera kép 13 MP, hỗ trợ chụp ảnh Ai, Bokeh hiệu quả
      Giải trí thả ga cả ngày dài - Viên pin lớn 5.000mAh, sạc siêu nhanh 33W`
   ]
   const names = [
      'iPhone 14 Pro/ Pro Max (2022)',
      'iPhone SE 2022.',
      'iPhone 13 mini (2021)',
      'iPhone 12 Pro Max (2020)'
   ]
   for (let i = 0; i < 12; i++) {
      const newprd = new Product()
      newprd.name = names[Math.floor(Math.random() * 5)]
      newprd.code = `IPP${i}` // 'TJK'
      newprd.productLine = 'IPHONE'
      newprd.status = status[Math.floor(Math.random() * 12)] // 0 - 11
      newprd.facotry = facotries[Math.floor(Math.random() * 2)]
      newprd.agency = agencies[Math.floor(Math.random() * 2)] // 154.00
      newprd.warrantyCenter = warranties[Math.floor(Math.random() * 2)] // 154.00
      newprd.des = des[Math.floor(Math.random() * 4)]
      newprd.img = images[Math.floor(Math.random() * 5)]
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
router.get('/filter', getFilterProducts)
router.post('/', createProduct)
router.get('/:id', getProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router
