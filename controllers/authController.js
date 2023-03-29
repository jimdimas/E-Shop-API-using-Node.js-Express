const crypto = require('crypto')
const sendVerificationEmail = require('../util/sendVerificationEmail')
const sendPasswordResetEmail = require('../util/sendPasswordResetEmail')
const {createAuthCookies} = require('../util/tokenService')
const User = require('../models/User')
const Token = require('../models/Token')

const register = async(req,res)=>{
    const {email,password,firstName,lastName} = req.body 
    let user = await User.findOne({email:email}) 

    if (user){
        return res.status(400).json({msg:"Failed to register,email already in use"})
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

    const user = await User.findOne({email:email})

    if (!user){
        return res.status(400).json({msg:"Failed to login,invalid credentials."})
    }

    const passwordMatch = await user.comparePassword(password)

    if (!passwordMatch){
        return res.status(400).json({msg:"Failed to login,invalid credentials."})
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
            return res.status(400).json({msg:"Failed to login"})
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
        return res.status(400).json({msg:"Wrong email"})
    }

    if (user.verificationToken!=token){
        return res.status(400).json({msg:"Invalid token"})
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
        return res.status(400).json({msg:"Invalid email provided"})
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
        return res.status(400).json({msg:"Invalid data provided"})
    }

    if (user.passwordToken!=token || user.passwordTokenExpirationDate<Date.now()){
        return res.status(400).json({msg:"Invalid token provided"})
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