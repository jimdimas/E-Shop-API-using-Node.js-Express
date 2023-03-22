const express = require('express')
const router = express.Router()
const {login,register,verifyEmail} = require('../controllers/authController')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/verifyEmail').get(verifyEmail)

module.exports = router