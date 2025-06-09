const express = require('express')
const router = express.Router()
const { getBills, createBill, deleteBill, getBillsById, updateBill, getBillsByUserId, deletUserBills, getBillsStats, validateBill, refuseBill, createBillWithAttachment } = require('../controllers/bill_controller.js')
const {verifyToken, isAdmin} = require('../controllers/login_controller.js')
const upload = require('../middlewares/upload.js')


router.get('/',verifyToken, getBills)

router.get('/:_id',verifyToken, getBillsById)

router.post('/',verifyToken, upload.single('proof') ,createBill)

router.post('/withAttachment', verifyToken, createBillWithAttachment)

router.delete('/:_id',verifyToken, deleteBill)

router.delete('/user/:_id', verifyToken, deletUserBills)

router.put('/:_id',verifyToken, updateBill)

router.get('/user/:id', verifyToken, getBillsByUserId)  

router.get('/stats/byUser', verifyToken, getBillsStats)

router.put('/:_id/validate', verifyToken, validateBill)

router.put('/:_id/reject', verifyToken, refuseBill)

module.exports = router

