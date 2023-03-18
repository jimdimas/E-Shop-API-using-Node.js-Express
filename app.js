const express = require('express')
const app=express()
require('dotenv').config()
const sendEmailInternal = require('./util/emailService')
const connectDB = require('./db/connect')

app.use(express.urlencoded({extended:false/true}))

const start = async()=>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(process.env.PORT,()=>{
            console.log(`Server is listening at port ${process.env.PORT}`)
        })
    }catch (err){
        console.log('Something went wrong,application didnt start')
    }
}

start()