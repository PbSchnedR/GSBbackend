const mongoose = require('mongoose')

const billSchema = new mongoose.Schema({
    date:{
        type: String,
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    },
    proof:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        default: 'Aucune description',
        required: true,
    },
    status:{
        type: String,
        default: 'En attente',
        enum: ["Validée", "En attente", "Refusée"],
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type:{
        type: String,
        enum: ["Repas", "Transport", "Autre", "Hébergement"],
        required: true,
    },
})

const Bill = mongoose.model('Bill', billSchema)

module.exports = Bill