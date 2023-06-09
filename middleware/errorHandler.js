const {StatusCodes} = require('http-status-codes')

const errorHandler = (err,req,res,next)=>{
    const error = {
        statusCode:err?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err?.message || "Something went wrong , please try again"
    }
    res.status(error.statusCode).json({msg:error.message})
}

module.exports = errorHandler