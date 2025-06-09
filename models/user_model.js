const mongoose = require('mongoose');
const sha256 = require('js-sha256');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        // Retire unique: true ici, car les mots de passe ne devraient pas être uniques
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    attachments: [{
    url: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    fileName: { 
        type: String,
        required: true
    },
}]

});

userSchema.pre('save', async function (next) {
    try {
        const existingUser = await this.constructor.findOne({ email: this.email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const secret = "secret";
        this.password = sha256(this.password + secret);
        next();
    } catch (error) {
        next(error); 
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;