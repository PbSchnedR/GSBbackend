const express = require('express')
const router = express.Router()
const { getUsers, getUsersById, createUser, deleteUser, updateUser, changeUserPassword, getUsersLength, createAttachment, getAttachments, deleteAttachment } = require('../controllers/user_controller.js')
const {verifyToken} = require('../controllers/login_controller.js')
const upload = require('../middlewares/upload.js')



router.get('/', verifyToken, getUsers)

router.get('/:_id',verifyToken, getUsersById),

router.get('/length/stats', verifyToken, getUsersLength)

router.post('/', createUser)

router.delete('/:_id',verifyToken, deleteUser)

router.put('/:_id',verifyToken, updateUser)

router.put('/changePassword/:_id', verifyToken, changeUserPassword)

router.post('/attachment/create', verifyToken, upload.array('proof'), createAttachment)

router.get('/attachment/get', verifyToken, getAttachments)

router.delete('/attachment/delete/:attachmentUrl', verifyToken, deleteAttachment)

module.exports = router

