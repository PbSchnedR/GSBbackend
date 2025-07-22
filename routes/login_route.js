const express = require('express')
const router = express.Router()
const {isAdmin, login, verifyToken, provideToken, logout} = require('../controllers/login_controller.js')


router.post('/', login)
router.get('/', provideToken)
router.get('/logout', logout)

module.exports = router