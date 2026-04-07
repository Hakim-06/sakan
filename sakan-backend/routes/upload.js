const express = require('express');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');
const { uploadProfile, uploadAnnonce, deleteFromCloudinary } = require('../middleware/upload');

const router = express.Router();

const hasCloudinaryConfig = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

const requireCloudinaryConfig = (req, res, next) => {
  if (hasCloudinaryConfig()) return next();
  return res.status(503).json({
    success: false,
    message: 'Cloudinary non configuré sur le serveur.',
  });
};

const runMulter = (middleware) => (req, res, next) => {
  middleware(req, res, (err) => {
    if (!err) return next();
    return res.status(400).json({
      success: false,
      message: err.message || 'Erreur upload.',
    });
  });
};

// ══════════════════════════════════════════════════════
// POST /api/upload/profile  — upload profile photo
// ══════════════════════════════════════════════════════
router.post('/profile', protect, requireCloudinaryConfig, runMulter(uploadProfile.single('photo')), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucune image fournie.' });
    }

    const user = await User.findById(req.user._id);

    // Delete old photo from Cloudinary if exists
    if (user.photo?.public_id) {
      await deleteFromCloudinary(user.photo.public_id);
    }

    // Save new photo
    user.photo = {
      url:       req.file.path,
      public_id: req.file.filename,
    };
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      photo: user.photo,
    });
  } catch (err) {
    console.error('UPLOAD PROFILE ERROR:', err);
    res.status(500).json({ success: false, message: 'Erreur upload photo.' });
  }
});

// ══════════════════════════════════════════════════════
// POST /api/upload/annonce  — upload annonce photos (max 6)
// ══════════════════════════════════════════════════════
router.post('/annonce', protect, requireCloudinaryConfig, runMulter(uploadAnnonce.array('photos', 6)), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Aucune image fournie.' });
    }

    const photos = req.files.map(file => ({
      url:       file.path,
      public_id: file.filename,
    }));

    res.json({
      success: true,
      photos,
      count: photos.length,
    });
  } catch (err) {
    console.error('UPLOAD ANNONCE ERROR:', err);
    res.status(500).json({ success: false, message: 'Erreur upload photos.' });
  }
});

// ══════════════════════════════════════════════════════
// DELETE /api/upload/:publicId  — delete a specific photo
// ══════════════════════════════════════════════════════
router.delete('/:publicId', protect, async (req, res) => {
  try {
    // Decode the public_id (contains slashes)
    const publicId = decodeURIComponent(req.params.publicId);
    await deleteFromCloudinary(publicId);
    res.json({ success: true, message: 'Photo supprimée.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur suppression photo.' });
  }
});

module.exports = router;