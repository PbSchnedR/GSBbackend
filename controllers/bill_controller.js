const User = require('../models/bill_model')
const {uploadToS3} = require('../utils/s3')

const getBills = async(req,res) => {
    try {
        const {id} = req.user
        const users = await User.find({user: id})
        if(!users || users.length === 0){
            return res.status(404).json({message: 'No bills found'})
        }
        res.status(200).json(users)
    /*const {id, role} = req.user
        let bills
        if(role === 'admin'){
            bills = await User.find()
            return res.json(bills)
        }
        else{
            bills = await User.find({user: id})
            return res.json(bills)
        }
        console.log(req.user)*/
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getBillsById = async(req,res) => {
    try{
        const bill = await User.findOne({_id : req.params._id})
        if(!bill){
         res.status(404).json({message: 'Bill not found'})
        }else{
        res.json(bill)}}
        catch (error) {
             res.status(500).json({message: error.message})
         }
}

const getBillsByUserId = async(req, res) => {
    try {
        const {id} = req.params
        const bills = await User.find({user: id})
        if(!bills){
            res.status(404).json({message: 'No bills found for this user'})
        } else {
            res.status(200).json(bills)
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}   

const createBill = async(req, res) => {
    
    try {
        const {date, amount, description, status, type} = JSON.parse(req.body.metadata)
        const {id} = req.user
        console.log(req.user)

        let proofUrl = null
        if (req.file) {
            proofUrl = await uploadToS3(req.file) 
        } else {
            throw new Error('Proof file is required', {cause: 400})
        }

        const newBill = new User({
            date : date,
            amount: amount,
            proof: proofUrl,
            description : description,
            status : status,
            user: id,
            type: type
        })
        await newBill.save()
        res.status(201).json(newBill)
    } catch (error) {
        res.status(500).json({messacvge: error.message})
    } 
}

const createBillWithAttachment = async(req, res) => {
    try{
        const {date, amount, description, status, type, proof} = req.body
        const {id} = req.user
        console.log(req.user)

        const newBill = new User({
            date : date,
            amount: amount,
            proof: proof,
            description : description,
            status : status,
            user: id,
            type: type
        })
        await newBill.save()
        res.status(201).json(newBill)

    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}

const deleteBill = async(req, res) => {
    try {
        const bill = await User.findOneAndDelete({_id : req.params._id})
        if(!bill){
            res.status(404).json({message: 'Bill not found'})
        } else {
            res.status(200).json({message: 'Bill deleted'})
        }
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}

const deletUserBills = async(req, res) => {
    try {
        const userId = req.params._id
        const bills = await User.deleteMany({user: userId})
        if(bills.deletedCount === 0){
            res.status(404).json({message: 'No bills found for this user'})
        } else {
            res.status(200).json({message: `${bills.deletedCount} bills deleted`})
        }
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }}

const updateBill = async(req, res) => {
    try {
        const user = await User.findOneAndUpdate({_id : req.params._id}, req.body, {new: true})
        if(!user){
            res.status(404).json({message: 'User not found'})
        } else {
            res.status(200).json(user)
        }
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }}

const getBillsStats = async(req, res) => {
    try {
        const {id} = req.user
        
        const userbills = await User.find({user: id}).select('date amount type').sort({date: -1})
        res.status(200).json(userbills)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}   

const validateBill = async(req, res) => {
    try {
        const bill = await User.findOneAndUpdate({_id : req.params._id}, {status: 'Validée'}, {new: true})
        if(!bill){
            res.status(404).json({message: 'Bill not found'})
        } else {
            res.status(200).json(bill)
        }
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }}

const refuseBill = async(req, res) => {
    try {
        const bill = await User.findOneAndUpdate({_id : req.params._id}, {status: 'Refusée'}, {new: true})
        if(!bill){
            res.status(404).json({message: 'Bill not found'})
        } else {
            res.status(200).json(bill)
        }
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }}

module.exports = {getBills, createBill, deleteBill, updateBill, getBillsById, getBillsByUserId, deletUserBills, getBillsStats, validateBill, refuseBill, createBillWithAttachment} //, getUsersByEmail, createUser, deleteUser}