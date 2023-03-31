const crypto = require('crypto')
const sendVerificationEmail = require('../util/sendVerificationEmail')
const sendPasswordResetEmail = require('../util/sendPasswordResetEmail')
const {createAuthCookies} = require('../util/tokenService')
const User = require('../models/User')
const Token = require('../models/Token')
const {BadRequestError,
    UnauthenticatedError,
    UnauthorizedError,
    NotFoundError} = require('../util/errors')

const register = async(req,res)=>{
    const {email,password,firstName,lastName} = req.body 
    let user = await User.findOne({email:email}) 

    if (user){
        throw new BadRequestError('Email already in use')
    }
    role='user'
    if (email==process.env.ADMIN_EMAIL){
        role='admin'
    }

    const verificationToken = await crypto.randomBytes(32).toString('hex')
    const userPrototype = {
        firstName:firstName,
        lastName:lastName,
        email:email,
        password:password,
        role:role,
        verificationToken:verificationToken
    }

    user = await User.create(userPrototype)
    await sendVerificationEmail(process.env.ORIGIN,firstName,email,verificationToken)
    res.status(200).json({msg:"Account created succesfully,please verify email to activate account."})
}

const login = async(req,res)=>{
    const {email,password}=req.body 

    if (!email || !password){
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email:email})

    if (!user){
        throw new UnauthenticatedError('Invalid credentials provided')
    }

    const passwordMatch = await user.comparePassword(password)

    if (!passwordMatch){
        throw new UnauthenticatedError('Invalid credentials provided')
    }

    if (!user.isVerified){
        throw new UnauthenticatedError('Please verify email first in order to login')
    }

    const token = await Token.findOne({user:user._id})
    const userToken = {
        userId:user._id,
        name:user.firstName,
        role:user.role
    }
    let refreshToken
    if (token){
        if (!token.valid){
            throw new UnauthenticatedError('Invalid credentials provided')
        }
        refreshToken=token.refreshToken
        createAuthCookies(res,userToken,refreshToken)
        return res.status(200).json({msg:"Successfull login"})
    }

    refreshToken = await crypto.randomBytes(32).toString('hex')
    const newToken = {
        user:user._id,
        refreshToken:refreshToken,
        ip:req.ip
    }
    await Token.create(newToken)
    createAuthCookies(res,userToken,refreshToken)
    res.status(200).json({msg:"Succesfull login."})
}

const verifyEmail = async(req,res)=>{
    const email = req.query.email
    const token = req.query.token

    const user = await User.findOne({email})

    if (!user){
        throw new NotFoundError('Invalid email provided')
    }

    if (user.verificationToken!=token){
        throw new UnauthenticatedError('Invalid token provided')
    }

    user.verificationToken=null
    user.isVerified=true
    user.verificationTimestamp=Date.now()
    await user.save()

    res.status(200).json({msg:"Email verified succesfully"})
}

const forgotPassword = async(req,res)=>{
    const {email} = req.body

    let user = await User.findOne({email})

    if (!user){
        throw new NotFoundError(`No user with ${email} exists`)
    }
    
    const thirtyMinutes = 30*60*1000;
    passwordToken = await crypto.randomBytes(32).toString('hex')
    user.passwordTokenExpirationDate = Date.now()+thirtyMinutes;
    user.passwordToken = passwordToken
    await sendPasswordResetEmail(process.env.ORIGIN,user.firstName,email,passwordToken)
    await user.save()
    res.status(200).json({msg:"Password reset email has been sent"})
}

const resetPassword = async(req,res)=>{
    const {email,password,token} = req.body 

    let user = await User.findOne({email})

    if (!user){
        throw new NotFoundError('Invalid email provided')
    }

    if (!user.passwordToken){
        throw new BadRequestError('No request to reset password found')
    }
    if (user.passwordToken!=token || user.passwordTokenExpirationDate<Date.now()){
        throw new UnauthenticatedError('Invalid token provided')
    }

    user.password=password 
    user.passwordToken=null 
    user.passwordTokenExpirationDate=null 
    await user.save()
    res.status(200).json({msg:"Password changed succesfully"})
}

const logout = async(req,res)=>{
    await Token.findOneAndDelete({refreshToken:req.refreshToken})
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(200).json({msg:"Succesfull logout"})
}

module.exports = {login,register,verifyEmail,forgotPassword,resetPassword,logout}