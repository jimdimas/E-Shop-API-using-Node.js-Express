const express = require('express')
const router = express.Router()
const {login,register,verifyEmail,forgotPassword,resetPassword} = require('../controllers/authController')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/verifyEmail').get(verifyEmail)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword').post(resetPassword)

module.exports = router