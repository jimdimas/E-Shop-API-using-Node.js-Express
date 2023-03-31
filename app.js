const express = require('express')
const cookieParser = require('cookie-parser')
const app=express()
require('dotenv').config()
require('express-async-errors')
const authRouter = require('./routes/authRouter')
const connectDB = require('./db/connect')
const errorHandlerMiddleware = require('./middleware/errorHandler')
app.use(express.json())
app.use(express.urlencoded({extended:false/true}))
app.use(cookieParser(process.env.TOKEN_SECRET))
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

app.use(errorHandlerMiddleware)
app.use((req,res)=>{
    res.status(404).json({msg:"Route not found"})
})
start()