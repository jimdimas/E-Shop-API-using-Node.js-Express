const jwt = require('jsonwebtoken')

const createAuthCookies = (res,user,token)=>{
    const accessToken = jwt.sign({user:user},process.env.TOKEN_SECRET)
    const refreshToken = jwt.sign({user:user,refreshToken:token},process.env.TOKEN_SECRET)
    
    const oneHour=1000*60*60
    const oneDay=oneHour*24
    res.cookie('accessToken',accessToken,{
        secure:false,
        expires:new Date(Date.now()+oneHour),
        signed:true,
        httpOnly:true 
    })
    res.cookie('refreshToken',refreshToken,{
        secure:false,
        expires:new Date(Date.now()+oneDay),
        signed:true,
        httpOnly:true
    })
}

module.exports={createAuthCookies}