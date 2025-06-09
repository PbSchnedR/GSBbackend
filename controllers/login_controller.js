const User = require('../models/user_model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const sha256 = require('js-sha256')

const JWT_SECRET = process.env.JWT_SECRET;

/*const handleLogin = async(req,res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email: email, password: password})
        if(!user){
            res.status(401).json({message: 'Invalid credentials'})
        } else {

            const token = jwt.sign(
                { id: user._id, name: user.name, email: user.email },
                JWT_SECRET,
                { expiresIn: '1h' }
              );

              res.json({token});
        }
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}

const authenticateToken = (req, res, next) => {
    try{
    const token = req.headers['authorization']?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }
  
    // Vérifier le token
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token invalide' });
      }
      // Ajouter les données de l'utilisateur à la requête
      req.user = user;
      next(); // Continuer vers la route protégée
    });
  }
    catch (error) {
        res.status(500).json({message: error.message})
    }}*/


// version de joss :

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
  if(user.password !== sha256(password + 'secret')){ // Remplacez 'secret' par le secret réel
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