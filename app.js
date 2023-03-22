const express = require('express')
const app=express()
require('dotenv').config()
const authRouter = require('./routes/authRouter')
const connectDB = require('./db/connect')

app.use(express.json())
app.use(express.urlencoded({extended:false/true}))
app.use('/api/auth',authRouter)


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