const {httpStatusCodes}=require('http-status-codes')

class BadRequestError extends Error{
    constructor(message){
        super(message)
        this.statusCode = httpStatusCodes.BAD_REQUEST
    }
}

class UnauthenticatedError extends Error{
    constructor(message){
        super(message)
        this.statusCode=httpStatusCodes.UNAUTHORIZED
    }
}

class UnauthorizedError extends Error{
    constructor(message){
        super(message)
        this.statusCode=httpStatusCodes.FORBIDDEN
    }
}

class NotFoundError extends Error{
    constructor(message){
        super(message)
        this.statusCode=httpStatusCodes.NOT_FOUND
    }
}

module.exports ={
    BadRequestError,
    UnauthenticatedError,
    UnauthorizedError,
    NotFoundError
}