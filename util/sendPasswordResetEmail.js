const sendEmail = require('./emailService')

const sendPasswordResetEmail = async(origin,name,to,passwordToken)=>{
    const html =`<p>Hello,${name},click the following link to reset your password.<p/>
    <a href="http://${origin}/api/auth/resetPassword?email=${to}&token=${passwordToken}">Click here</a>`

    await sendEmail(to,"Eshop Password Reset",html)
}

module.exports = sendPasswordResetEmail