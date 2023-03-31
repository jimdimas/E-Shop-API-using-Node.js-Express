const {StatusCodes}=require('http-status-codes')

class BadRequestError extends Error{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

class UnauthenticatedError extends Error{
    constructor(message){
        super(message)
        this.statusCode=StatusCodes.UNAUTHORIZED
    }
}

class UnauthorizedError extends Error{
    constructor(message){
        super(message)
        this.statusCode=StatusCodes.FORBIDDEN
    }
}

class NotFoundError extends Error{
    constructor(message){
        super(message)
        this.statusCode=StatusCodes.NOT_FOUND
    }
}

module.exports ={
    BadRequestError,
    UnauthenticatedError,
    UnauthorizedError,
    NotFoundError
}