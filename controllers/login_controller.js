const User = require('../models/user_model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const sha256 = require('js-sha256')

const JWT_SECRET = process.env.JWT_SECRET;

const isAdmin = (req, res, next) => {
  try{
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token invalide' });
      }
      req.user = decoded;
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé' });
      }
      next();
    });

  }catch (error) {
    res.status(500).json({message: error.message})
  }
}


const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if(!user){
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  if(user.password !== sha256(password + 'secret')){ 
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });

}

const verifyToken = (req, res, next) =>{
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
    req.user = decoded;
    next();
  });
}


module.exports = {
    // handleLogin,
   // authenticateToken,
    isAdmin,
    login,
    verifyToken
}