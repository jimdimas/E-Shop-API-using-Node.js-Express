const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,'Please provide a first name'],
        maxlength:50
    },
    lastName:{
        type:String,
        required:[true,'Please provide a last name'],
        maxlength:50
    },
    email:{
        type:String,
        unique:true,
        required:[true,'Please provide an email'],
        validate:{
            validator:validator.isEmail,
            message:'Please provide an email'
        }
    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:8
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationToken:String,
    verificationTimestamp:Date,
    passwordToken:String,
    passwordTokenExpirationDate:Date,
})

UserSchema.pre('save',async function(){
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(this.password,salt)
    this.password = hashedPassword
})

UserSchema.methods.comparePassword = async function(testPassword){
    const match = await bcrypt.compare(testPassword,this.password)
    return match;
}

module.exports = mongoose.model('User',UserSchema)