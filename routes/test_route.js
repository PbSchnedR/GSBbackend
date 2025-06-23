const express = require('express')
const router = express.Router()
const testController = require('../controllers/test_controller.js');

router.get('/', testController)

module.exports = router