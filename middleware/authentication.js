const jwt = require('jsonwebtoken')
const Token = require('../models/Token')
const {createAuthCookies} = require('../util/tokenService')
const {UnauthorizedError} = require('../util/errors')
    
const authenticationMiddleware = async (req,res,next)=>{
    try{
        const {accessToken,refreshToken} = req.signedCookies 

        if (accessToken){
            const user = jwt.verify(accessToken,process.env.TOKEN_SECRET)
            req.user = user
            return next()
        }
        
        const refreshTokenDecoded = jwt.verify(refreshToken,process.env.TOKEN_SECRET)
        const dbToken = await Token.findOne({
            user:refreshTokenDecoded.user.userId,
            refreshToken:refreshTokenDecoded.refreshToken
        })

        if (!dbToken || !dbToken?.valid){
            throw new UnauthorizedError('Unauthorized to access this route')
        }

        createAuthCookies(res,refreshTokenDecoded.user,refreshTokenDecoded.refreshToken)
        req.user = refreshTokenDecoded.user
        next()
        
    } catch(err){
        throw new UnauthorizedError('Unauthorized to access this route')
    }
}

module.exports = {authenticationMiddleware}