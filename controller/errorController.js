module.exports = (err, req, res, next) => {
   err.statusCode = err.statusCode || 500
   err.staus = err.status || 'error'
   res.status(err.statusCode).json({
      status: err.status,
      message: err.message
   })
}
