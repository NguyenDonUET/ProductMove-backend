class APIFeatures {
   constructor(query, queryString) {
      this.query = query
      this.queryString = queryString
   }
   filter() {
      const queryObj = { ...this.queryString }
      // bỏ đi những key này trong filter
      const excludeFields = ['page', 'sort', 'limit', 'fields']
      excludeFields.forEach(el => delete queryObj[el])
      // advance filter: chỉ lấy những value >, <, >=, <=
      let queryStr = JSON.stringify(queryObj).replaceAll(
         /\b(gte|gt|lte|lt)\b/g,
         match => `$${match}`
      )
      this.query = this.query.find(JSON.parse(queryStr))
      // let query = Tour.find(JSON.parse(queryStr));
      return this
   }
   sort() {
      if (this.queryString.sort) {
         const sortBy = this.queryString.sort.split(',').join(' ')
         this.query = this.query.sort(sortBy)
      } else {
         this.query = this.query.sort('-produceDate')
      }
      return this
   }
   limitFields() {
      if (this.queryString.fields) {
         const fields = this.queryString.fields.split(',').join(' ')
         this.query = this.query.select(fields)
      } else {
         // bỏ tt __v đi
         this.query = this.query.select('-__v')
      }
      return this
   }

   paginate() {
      const page = this.queryString.page * 1 || 1
      const limit = this.queryString.limit * 1 || 100
      const skip = (page - 1) * limit

      this.query = this.query.skip(skip).limit(limit)
      return this
   }
}

module.exports = {
   APIFeatures
}
