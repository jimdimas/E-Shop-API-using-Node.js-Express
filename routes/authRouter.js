const express = require('express')
const router = express.Router()
const {login,register,verifyEmail,forgotPassword,resetPassword,logout} = require('../controllers/authController')
const {authenticationMiddleware} = require('../middleware/authentication')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/verifyEmail').get(verifyEmail)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword').post(resetPassword)
router.route('/logout').post(authenticationMiddleware,logout)

module.exports = router