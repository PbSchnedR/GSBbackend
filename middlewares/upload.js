const multer = require('multer');

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
   if (file.mimetype.startsWith('image/')) {
       cb(null, true); 
   }else {
       cb(new Error('Invalid file type. Only images are allowed.'), false); 
   }
}

const upload = multer({ 
   storage: storage,
   limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille de fichier à 5 Mo
   fileFilter: fileFilter
})

module.exports = upload