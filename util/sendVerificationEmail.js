const sendEmail = require('./emailService')

const sendVerificationEmail = async(origin,name,to,token)=>{
    const html=`<p>Hello,${name},please click in the following link to verify your email.
    <a href="http://${origin}/api/auth/verifyEmail?email=${to}&token=${token}">Click here</a>`

    sendEmail(to,"Eshop Email Verification",html)
}

module.exports = sendVerificationEmail