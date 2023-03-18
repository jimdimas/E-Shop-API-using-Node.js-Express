const nodemailer = require('nodemailer')

const sendEmailInternal = async function(from,to,subject,text){
    let transporter = await nodemailer.createTransport({
        service:process.env.NODEMAILER_SERVICE,
        auth:{
            user:process.env.NODEMAILER_USER,
            pass:process.env.NODEMAILER_PASS
        }
    });

    let message = await transporter.sendMail({
        from:process.env.NODEMAILER_USER,
        to:to,
        subject:subject,
        text:text,
        html:text
    })
}

module.exports = sendEmailInternal

