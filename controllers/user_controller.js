const User = require('../models/user_model')
const sha256 = require('js-sha256');
const {uploadToS3} = require('../utils/s3')

const getUsers = async(req,res) => {
    try {
        // Récupérer tous les utilisateurs
        // Si un email est fourni dans la requête, filtrer par cet email
        const email = req.query.email ? {email: req.query.email} : {}
        const users = await User.find(email)
        res.json(users)
    }
    catch (error) {
        res.status(500).json({messagefdp: error.message})
    }
}

const getUsersLength = async(req,res) => {
    try {
        // Récupérer tous les utilisateurs
        // Si un email est fourni dans la requête, filtrer par cet email
        const email = req.query.email ? {email: req.query.email} : {}
        const users = await User.find(email)
        res.json(users.length)
    }
    catch (error) {
        res.status(500).json({messagefdp: error.message})
    }
}

const getUsersById = async(req,res) => {
    try{
   const user = await User.findOne({_id : req.params._id})
   if(!user){
    res.status(404).json({message: 'User not found'})
   }else{
   res.json(user)}}
   catch (error) {
        res.status(500).json({message: error.message})
    }
   
}

const createUser = async (req, res) => {
    const newUser = req.body;
    try {
        const user = await User.create(newUser);
        return res.status(201).json(user); // Réponse 1
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.status(409).json({ message: "User already exists" }); // Réponse 2, avec return
        }
        return res.status(500).json({ message: error.message }); // Réponse 3
    }
};

const deleteUser = async(req, res) => {
    try {
        const user = await User.findOneAndDelete({_id : req.params._id})
        if(!user){
            res.status(404).json({message: 'User not found'})
        } else {
            res.status(200).json({message: 'User deleted'})
        }
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}

const updateUser = async(req, res) => {
    try {
        
       const {name, role, email} = req.body
       const user = await User.findOneAndUpdate({_id : req.params._id}, {name : name, role, email: email}, {new: true})
       if(!user){
        res.status(404).json({message: 'User not found'})
       } else {
        res.status(200).json(user)
       }
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }}

const changeUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // On cherche l'utilisateur par son ID
        const user = await User.findById(req.params._id);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Vérifie si l'ancien mot de passe est correct
        const hashedPassword = sha256(currentPassword + 'secret').toString();
        if (user.password !== hashedPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Hachage du nouveau mot de passe
        const newHashedPassword = sha256(newPassword + 'secret').toString();

        await User.updateOne({ _id: req.params._id }, { password: newHashedPassword });


        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createAttachment = async (req, res) => {
  try {
    const { id } = req.user;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one proof file is required' });
    }

    // Upload tous les fichiers sur S3, récupère leurs URLs et noms corrigés
    const attachments = await Promise.all(
      req.files.map(async (file) => {
        const proofUrl = await uploadToS3(file);
        const fixedFileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        return {
          url: proofUrl,
          fileName: fixedFileName,
        };
      })
    );

    const user = await User.findByIdAndUpdate(
      id,
      {
        $push: {
          attachments: { $each: attachments }
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Attachments added successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





const getAttachments = async (req, res) => {
    try {
        const { id } = req.user;

        // Récupérer l'utilisateur par ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Retourner les pièces jointes de l'utilisateur
        res.status(200).json(user.attachments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteAttachment = async (req, res) => {
  try {
    const { id } = req.user;
    const { attachmentId } = req.query;

    if (!attachmentId) {
      return res.status(400).json({ message: 'Attachment ID is required' });
    }

    const result = await User.updateOne(
      { _id: id },
      { $pull: { attachments: { _id: attachmentId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Attachment not found or already deleted' });
    }

    const updatedUser = await User.findById(id);

    res.status(200).json({ message: 'Attachment deleted successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




module.exports = {getUsers, getUsersById, createUser, deleteUser, updateUser, changeUserPassword, getUsersLength, createAttachment, getAttachments, deleteAttachment} //, getUsersByEmail, createUser, deleteUser}