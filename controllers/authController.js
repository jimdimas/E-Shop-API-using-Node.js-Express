const crypto = require('crypto')
const sendVerificationEmail = require('../util/sendVerificationEmail')
const User = require('../models/User')

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

    const passwordMatch = user.comparePassword(password)

    if (!passwordMatch){
        return res.status(400).json({msg:"Failed to login,invalid credentials."})
    }

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

module.exports = {login,register,verifyEmail}