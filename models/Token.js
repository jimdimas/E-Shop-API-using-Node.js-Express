const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'Please provide user id']
    },
    refreshToken:{
        type:String,
        unique:true,
        required:[true,'Please provide refresh token']
    },
    ip:{
        type:String,
        unique:true,
        required:[true,'Please provide ip address']
    },
    valid:{
        type:Boolean,
        default:true,
    }
},{timestamps:true})

module.exports = mongoose.model('Token',TokenSchema)