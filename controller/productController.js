const Product = require('../models/productModel')
const { APIFeatures } = require('../utils/apiFeatures')

const createProduct = async (req, res) => {
   try {
      const product = await Product.create(req.body)
      res.status(200).json({
         status: 'Create success',
         data: product
      })
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

const getAllProducts = async (req, res) => {
   try {
      // Execute query
      const products = new APIFeatures(Product.find(), req.query)
         .filter()
         .sort()
         .limitFields()
         .paginate()
      const data = await products.query
      const total = await Product.countDocuments({})
      // số lượng sản phẩm xuất hiện trên 1 page
      const PAGE_SIZE = req.query.limit * 1 || 10
      const numsPage = Math.ceil(total / PAGE_SIZE)
      res.status(200).json({
         total,
         numsPage,
         pageSize: data.length,
         data
      })
   } catch (error) {
      res.status(500).json({ status: 'Fail', msg: error.message })
   }
}

// const paginateProducts = async (req, res) => {
//    const currentPage = parseInt(req.query.page) || 1
//    // số page bỏ qua
//    const start = (currentPage - 1) * PAGE_SIZE
//    // lấy tổng số số trang
//    let totalPage = 0
//    let totalProduct = 0
//    await Product.countDocuments({}).then(total => {
//       totalPage = Math.ceil(total / PAGE_SIZE)
//       totalProduct = total
//    })
//    // lấy data dựa vào trang
//    const products = await Product.find({}).skip(start).limit(PAGE_SIZE)
//    res.status(200).json({
//       totalProduct,
//       totalPage,
//       pageSize: PAGE_SIZE,
//       page: currentPage,
//       data: products
//    })
// }

const getProduct = async (req, res) => {
   try {
      const { id } = req.params
      const product = await Product.findById(id)
      if (!product) {
         return res.status(404).json(`No product with id: ${id}`)
      }
      res.status(200).json(product)
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

const updateProduct = async (req, res) => {
   try {
      const { id } = req.params
      const product = await Product.findByIdAndUpdate(
         {
            _id: id
         },
         req.body,
         {
            new: true,
            runValidators: true
         }
      )
      if (!product) {
         return res.status(404).json(`No product with id: ${id}`)
      }
      res.status(200).json(product)
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

const deleteProduct = async (req, res) => {
   try {
      const { id } = req.params
      const product = await Product.findByIdAndDelete(id)
      if (!product) {
         return res.status(404).json(`No product with id: ${id}`)
      }

      res.status(200).send('product deleted')
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

module.exports = {
   getAllProducts,
   getProduct,
   createProduct,
   updateProduct,
   deleteProduct
}
