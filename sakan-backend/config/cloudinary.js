const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. N-connectew m3a l-compte Cloudinary dyalk
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. N-gaddou l-Storage (fin w kifach gha y-t-sajlo t-tsawer)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sakan_annonces', // Smiya dyal l-dossier li gha y-t-creya f Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // L-anwa3 dyal t-tsawer l-m9boula
  },
});

// 3. N-wejdou l-Middleware `upload` li gha n-khdmou bih f l-Routes
const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };