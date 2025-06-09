const express = require('express')
const router = express.Router()
const {isAdmin, login, verifyToken} = require('../controllers/login_controller.js')


// router.post('/', handleLogin)

/*try{
    router.get('/', authenticateToken, (req, res) => {
        res.json({message: 'Vous êtes authentifié', user: req.user})
    })
    
}catch (error) {
    res.status(500).json({message: error.message})
}*/

router.post('/', login)

module.exports = router