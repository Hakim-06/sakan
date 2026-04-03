const express   = require('express');
const { body, validationResult } = require('express-validator');
const User      = require('../models/User');
const { protect, generateToken } = require('../middleware/auth');

const router = express.Router();

// ─── Helper: send token response ─────────────────────
const sendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id:             user._id,
      name:            user.name,
      email:           user.email,
      photo:           user.photo,
      profileComplete: user.profileComplete,
    },
  });
};

// ─── Validation rules ────────────────────────────────
const registerRules = [
  body('name').trim().notEmpty().withMessage('Prénom requis').isLength({ max: 50 }),
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe: minimum 6 caractères'),
];
const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Mot de passe requis'),
];

// ══════════════════════════════════════════════════════
// POST /api/auth/register
// ══════════════════════════════════════════════════════
router.post('/register', registerRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Cet email est déjà utilisé.' });
    }

    const user = await User.create({ name, email, password });
    sendToken(user, 201, res);

  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'inscription.' });
  }
});

// ══════════════════════════════════════════════════════
// POST /api/auth/login
// ══════════════════════════════════════════════════════
router.post('/login', loginRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Find user + include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }

    // Update last seen
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save({ validateBeforeSave: false });

    sendToken(user, 200, res);

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ success: false, message: 'Erreur lors de la connexion.' });
  }
});

// ══════════════════════════════════════════════════════
// GET /api/auth/me  — get current logged-in user
// ══════════════════════════════════════════════════════
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites', 'city budget photos');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ══════════════════════════════════════════════════════
// POST /api/auth/logout
// ══════════════════════════════════════════════════════
router.post('/logout', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isOnline: false, lastSeen: new Date() });
    res.json({ success: true, message: 'Déconnecté avec succès.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;