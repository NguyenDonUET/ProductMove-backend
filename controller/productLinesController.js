const asyncHandler = require('express-async-handler')
const ProductLine = require('../models/productLineModel')
const { APIFeatures } = require('../utils/apiFeatures')

const PAGE_SIZE = 6 // số lượng sản phẩm xuất hiện trên 1 page

const getAllProductLines = async (req, res) => {
   try {
      // Execute query
      const productLines = new APIFeatures(ProductLine.find(), req.query)
         .filter()
         .sort()
         .limitFields()
         .paginate()
      const data = await productLines.query
      const total = await ProductLine.countDocuments({})
      // số lượng sản phẩm xuất hiện trên 1 page
      const PAGE_SIZE = req.query.limit * 1 || 12
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

const createProductLine = async (req, res) => {
   try {
      const { name, code } = req.body.newProductLine

      // Tên và mã sp ko được trùng
      const isDuplicateName = await ProductLine.findOne({ name })
      const isDuplicateCode = await ProductLine.findOne({ code })

      let type = 'none'
      if (isDuplicateCode || isDuplicateName) {
         if (isDuplicateName && isDuplicateCode) {
            type = 'both'
         } else if (isDuplicateName) {
            type = 'name'
         } else if (isDuplicateCode) {
            type = 'code'
         }
         res.status(400).json({
            msg: 'Tên hoặc mã bị trùng',
            type
         })
      } else {
         const productLine = await ProductLine.create(req.body.newProductLine)
         res.status(200).json({
            status: 'Create succes',
            data: productLine
         })
      }
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}
// lấy 1 dòng sản phẩm
const getProductLine = async (req, res) => {
   try {
      const { id } = req.params
      const productLine = await ProductLine.findById(id)
      if (!productLine) {
         return res.status(404).json(`No productLine with id: ${id}`)
      }
      res.status(200).json(productLine)
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

const updateProductLine = async (req, res) => {
   try {
      const { id } = req.params
      const productLine = await ProductLine.findByIdAndUpdate(
         {
            _id: id
         },
         req.body.newProductLine,
         {
            new: true,
            runValidators: true
         }
      )
      if (!productLine) {
         return res.status(404).json(`No productLine with id: ${id}`)
      }
      res.status(200).json({
         status: 'update success',
         data: productLine
      })
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

const deleteProductLine = async (req, res) => {
   try {
      const { id } = req.params
      const productLine = await ProductLine.findByIdAndDelete(id)
      if (!productLine) {
         return res.status(404).json(`No productLine with id: ${id}`)
      }
      res.status(200).send('productLine deleted')
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

// Xử lý trùng data

// Phần trang
const paginateProductLines = asyncHandler(async (req, res) => {
   const currentPage = parseInt(req.query.page) || 1
   // số page bỏ qua
   const start = (currentPage - 1) * PAGE_SIZE
   // lấy tổng số số trang
   let totalPage = 0
   let totalProductLine = 0
   await ProductLine.countDocuments({}).then(total => {
      totalPage = Math.ceil(total / PAGE_SIZE)
      totalProductLine = total
   })
   // lấy data dựa vào trang
   const productLines = await ProductLine.find({}).skip(start).limit(PAGE_SIZE)
   res.status(200).json({
      totalProductLine,
      totalPage,
      pageSize: PAGE_SIZE,
      page: currentPage,
      data: productLines
   })
})

module.exports = {
   getAllProductLines,
   createProductLine,
   getProductLine,
   updateProductLine,
   deleteProductLine
}
