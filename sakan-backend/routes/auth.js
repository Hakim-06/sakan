const express   = require('express');
const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const User      = require('../models/User');
const { protect, generateToken } = require('../middleware/auth');
const { sendEmail } = require('../utils/mailer');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
const forgotPasswordRules = [
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
];
const resendVerificationRules = [
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
];
const resetPasswordRules = [
  body('token').notEmpty().withMessage('Token requis'),
  body('newPassword').isLength({ min: 6 }).withMessage('Mot de passe: minimum 6 caractères'),
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

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      emailVerifyToken: tokenHash,
      emailVerifyTokenExpires: expiresAt,
    });

    const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
    const verifyUrl = `${frontendUrl}/login?verifyToken=${rawToken}`;
    let mailResult = { sent: false, reason: 'unknown' };
    try {
      mailResult = await sendEmail({
        to: email,
        subject: 'Vérifie ton email - SakanCampus',
        text: `Confirme ton compte via ce lien: ${verifyUrl}`,
        html: `
          <p>Bonjour ${name},</p>
          <p>Bienvenue sur SakanCampus. Clique sur ce lien pour vérifier ton email:</p>
          <p><a href="${verifyUrl}">${verifyUrl}</a></p>
          <p>Ce lien expire dans 24 heures.</p>
        `,
      });
    } catch (mailErr) {
      console.error('REGISTER EMAIL ERROR:', mailErr?.message || mailErr);
      mailResult = { sent: false, reason: mailErr?.message || 'smtp error' };
    }

    if (!mailResult.sent) {
      user.isVerified = true;
      user.emailVerifyToken = null;
      user.emailVerifyTokenExpires = null;
      await user.save({ validateBeforeSave: false });

      return res.status(201).json({
        success: true,
        requiresEmailVerification: true,
        message: 'Compte créé. Email temporairement indisponible, connecte-toi directement.',
      });
    }

    const response = {
      success: true,
      message: 'Compte créé. Vérifie ton email pour activer ton accès.',
      requiresEmailVerification: true,
      expiresAt,
    };

    return res.status(201).json(response);

  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({
      success: false,
      message: err?.message || 'Erreur lors de l\'inscription.',
    });
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
      return res.status(404).json({ success: false, message: 'Cet email n\'existe pas.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Email non vérifié. Vérifie ta boîte mail avant de te connecter.' });
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
// POST /api/auth/verify-email
// ══════════════════════════════════════════════════════
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token requis.' });
    }

    const tokenHash = crypto.createHash('sha256').update(String(token)).digest('hex');
    const user = await User.findOne({
      emailVerifyToken: tokenHash,
      emailVerifyTokenExpires: { $gt: new Date() },
    }).select('+emailVerifyToken +emailVerifyTokenExpires');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Lien de vérification invalide ou expiré.' });
    }

    user.isVerified = true;
    user.emailVerifyToken = null;
    user.emailVerifyTokenExpires = null;
    await user.save({ validateBeforeSave: false });

    return res.json({ success: true, message: 'Email vérifié avec succès. Tu peux te connecter.' });
  } catch (err) {
    console.error('VERIFY EMAIL ERROR:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la vérification email.' });
  }
});

// ══════════════════════════════════════════════════════
// POST /api/auth/resend-verification
// ══════════════════════════════════════════════════════
router.post('/resend-verification', resendVerificationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select('+emailVerifyToken +emailVerifyTokenExpires');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Cet email n\'existe pas.' });
    }

    if (user.isVerified) {
      return res.status(409).json({ success: false, message: 'Cet email est déjà vérifié.' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerifyToken = tokenHash;
    user.emailVerifyTokenExpires = expiresAt;
    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
    const verifyUrl = `${frontendUrl}/login?verifyToken=${rawToken}`;
    const mailResult = await sendEmail({
      to: email,
      subject: 'Nouveau lien de vérification - SakanCampus',
      text: `Confirme ton compte via ce lien: ${verifyUrl}`,
      html: `
        <p>Bonjour ${user.name || ''},</p>
        <p>Voici un nouveau lien pour vérifier ton email:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>Ce lien expire dans 24 heures.</p>
      `,
    });

    if (!mailResult.sent && process.env.NODE_ENV === 'production') {
      return res.status(503).json({ success: false, message: 'Service email indisponible. Réessaie plus tard.' });
    }

    const response = {
      success: true,
      message: 'Nouveau lien envoyé. Vérifie ta boîte mail.',
      expiresAt,
    };

    if (!mailResult.sent && process.env.NODE_ENV !== 'production') {
      response.devVerifyToken = rawToken;
      response.message = 'SMTP non configuré. Utilise le token de dev pour vérifier le compte.';
    }

    return res.json(response);
  } catch (err) {
    console.error('RESEND VERIFICATION ERROR:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi du lien de vérification.' });
  }
});

// ══════════════════════════════════════════════════════
// POST /api/auth/forgot-password
// ══════════════════════════════════════════════════════
router.post('/forgot-password', forgotPasswordRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select('+passwordResetToken +passwordResetTokenExpires');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Cet email n\'existe pas.' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    user.passwordResetToken = tokenHash;
    user.passwordResetTokenExpires = expiresAt;
    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/login?resetToken=${rawToken}`;

    const mailResult = await sendEmail({
      to: email,
      subject: 'Réinitialisation du mot de passe - SakanCampus',
      text: `Réinitialise ton mot de passe via ce lien: ${resetUrl}`,
      html: `
        <p>Bonjour,</p>
        <p>Pour réinitialiser ton mot de passe, clique sur ce lien:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Ce lien expire dans 15 minutes.</p>
      `,
    });

    if (!mailResult.sent && process.env.NODE_ENV === 'production') {
      return res.status(503).json({ success: false, message: 'Service email indisponible. Réessaie plus tard.' });
    }

    const response = {
      success: true,
      message: 'Un lien de réinitialisation a été envoyé à ton email.',
      expiresAt,
    };

    if (!mailResult.sent && process.env.NODE_ENV !== 'production') {
      response.devResetToken = rawToken;
      response.message = 'SMTP non configuré. Utilise le token de dev pour réinitialiser.';
    }

    return res.json(response);
  } catch (err) {
    console.error('FORGOT PASSWORD ERROR:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la demande de réinitialisation.' });
  }
});

// ══════════════════════════════════════════════════════
// POST /api/auth/reset-password
// ══════════════════════════════════════════════════════
router.post('/reset-password', resetPasswordRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { token, newPassword } = req.body;
    const tokenHash = crypto.createHash('sha256').update(String(token)).digest('hex');

    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetTokenExpires: { $gt: new Date() },
    }).select('+password +passwordResetToken +passwordResetTokenExpires');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Lien de réinitialisation invalide ou expiré.' });
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    await user.save();

    return res.json({ success: true, message: 'Mot de passe réinitialisé avec succès.' });
  } catch (err) {
    console.error('RESET PASSWORD ERROR:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la réinitialisation du mot de passe.' });
  }
});

// ══════════════════════════════════════════════════════
// POST /api/auth/google
// ══════════════════════════════════════════════════════
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token Google manquant.' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ success: false, message: 'GOOGLE_CLIENT_ID non configuré.' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name || 'Utilisateur Google';
    const picture = payload?.picture || '';

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email Google introuvable.' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Password placeholder so local schema constraints remain valid.
      user = await User.create({
        name,
        email,
        password: `google-${Math.random().toString(36).slice(2)}-${Date.now()}`,
        photo: picture ? { url: picture, public_id: '' } : undefined,
        isVerified: true,
      });
    } else {
      if (picture && !user.photo?.url) {
        user.photo = { url: picture, public_id: '' };
      }
      user.isOnline = true;
      user.lastSeen = new Date();
      await user.save({ validateBeforeSave: false });
    }

    sendToken(user, 200, res);

  } catch (err) {
    console.error('GOOGLE LOGIN ERROR:', err);
    res.status(401).json({ success: false, message: 'Token Google invalide.' });
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