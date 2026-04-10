const express = require('express');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');
const { sortByCompatibility } = require('../utils/matching');
const crypto = require('crypto');
const { sendEmail } = require('../utils/mailer');

const router = express.Router();

// ══════════════════════════════════════════════════════
// GET /api/users/feed  — get users sorted by compatibility
// ══════════════════════════════════════════════════════
router.get('/feed', protect, async (req, res) => {
  try {
    const { city, minBudget, maxBudget, page = 1, limit = 20 } = req.query;

    const filter = {
      _id:             { $ne: req.user._id }, // exclude self
      profileComplete: true,
    };
    if (city)      filter.city   = { $regex: city, $options: 'i' };
    if (minBudget) filter.budget = { ...filter.budget, $gte: Number(minBudget) };
    if (maxBudget) filter.budget = { ...filter.budget, $lte: Number(maxBudget) };

    const users = await User.find(filter)
      .select('name age gender ecole city budget bio traits photo isOnline lastSeen profileComplete preferences')
      .limit(Number(limit) * Number(page))
      .lean({ virtuals: true });

    // Apply AI matching — sort by compatibility score
    const currentUser = await User.findById(req.user._id);
    const sorted = sortByCompatibility(currentUser, users);

    res.json({
      success: true,
      count: sorted.length,
      users: sorted,
    });
  } catch (err) {
    console.error('FEED ERROR:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ══════════════════════════════════════════════════════
// PUT /api/users/profile  — update current user's profile
// ══════════════════════════════════════════════════════
router.put('/profile', protect, async (req, res) => {
  try {
    const allowed = ['name', 'age', 'gender', 'ecole', 'city', 'budget', 'bio', 'phone', 'traits', 'preferences'];
    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (updates.preferences && typeof updates.preferences === 'object') {
      const allowedPreferences = ['genderPref', 'smokingOk', 'petsOk', 'visitorsOk', 'hidePhone', 'onlineStatus', 'emailAlerts', 'darkMode'];
      updates.preferences = Object.fromEntries(
        Object.entries(updates.preferences).filter(([key]) => allowedPreferences.includes(key))
      );
    }

    // Validate traits array (max 4)
    if (updates.traits && updates.traits.length > 4) {
      return res.status(400).json({ success: false, message: 'Maximum 4 traits autorisés.' });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    if (user?.preferences?.onlineStatus === false) {
      user.isOnline = false;
      user.lastSeen = new Date();
    }

    user.checkProfileComplete();
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, user });
  } catch (err) {
    console.error('PROFILE UPDATE ERROR:', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════
// POST /api/users/email-change/request  — request email change
// ══════════════════════════════════════════════════════
router.post('/email-change/request', protect, async (req, res) => {
  try {
    const { newEmail, currentPassword } = req.body;
    if (!newEmail || !currentPassword) {
      return res.status(400).json({ success: false, message: 'Nouvel email et mot de passe actuel requis.' });
    }

    const normalizedEmail = String(newEmail).trim().toLowerCase();
    const validEmail = /^\S+@\S+\.\S+$/.test(normalizedEmail);
    if (!validEmail) {
      return res.status(400).json({ success: false, message: 'Adresse email invalide.' });
    }

    const user = await User.findById(req.user._id).select('+password +emailChangeToken +emailChangeTokenExpires');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    }

    if (normalizedEmail === user.email) {
      return res.status(400).json({ success: false, message: 'Ce nouvel email est identique à l\'email actuel.' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect.' });
    }

    const taken = await User.findOne({ email: normalizedEmail });
    if (taken) {
      return res.status(409).json({ success: false, message: 'Cet email est déjà utilisé.' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    user.pendingEmail = normalizedEmail;
    user.emailChangeToken = tokenHash;
    user.emailChangeTokenExpires = expiresAt;
    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyUrl = `${frontendUrl}/feed?emailVerifyToken=${rawToken}`;
    const mailResult = await sendEmail({
      to: normalizedEmail,
      subject: 'Confirme ton nouvel email - SakanCampus',
      text: `Clique sur ce lien pour confirmer ton nouvel email: ${verifyUrl}`,
      html: `
        <p>Bonjour,</p>
        <p>Clique sur ce lien pour confirmer ton nouvel email:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>Ce lien expire dans 15 minutes.</p>
      `,
    });

    if (!mailResult.sent && process.env.NODE_ENV === 'production') {
      return res.status(503).json({ success: false, message: 'Service email indisponible. Réessaie plus tard.' });
    }

    const response = {
      success: true,
      message: 'Demande envoyée. Vérifie ta boîte mail pour confirmer le changement.',
      pendingEmail: normalizedEmail,
      expiresAt,
    };

    if (!mailResult.sent && process.env.NODE_ENV !== 'production') {
      response.devVerificationToken = rawToken;
      response.message = 'SMTP non configuré. Utilise le token de dev pour vérifier.';
    }

    return res.json(response);
  } catch (err) {
    console.error('EMAIL CHANGE REQUEST ERROR:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ══════════════════════════════════════════════════════
// POST /api/users/email-change/verify  — confirm email change
// ══════════════════════════════════════════════════════
router.post('/email-change/verify', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token requis.' });
    }

    const tokenHash = crypto.createHash('sha256').update(String(token)).digest('hex');
    const user = await User.findOne({
      emailChangeToken: tokenHash,
      emailChangeTokenExpires: { $gt: new Date() },
      pendingEmail: { $ne: null },
    }).select('+emailChangeToken +emailChangeTokenExpires');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token invalide ou expiré.' });
    }

    const taken = await User.findOne({ email: user.pendingEmail, _id: { $ne: user._id } });
    if (taken) {
      return res.status(409).json({ success: false, message: 'Cet email est déjà utilisé.' });
    }

    user.email = user.pendingEmail;
    user.pendingEmail = null;
    user.emailChangeToken = null;
    user.emailChangeTokenExpires = null;
    user.isVerified = true;
    await user.save();

    return res.json({
      success: true,
      message: 'Adresse email mise à jour avec succès.',
      email: user.email,
    });
  } catch (err) {
    console.error('EMAIL CHANGE VERIFY ERROR:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ══════════════════════════════════════════════════════
// GET /api/users/:id  — get any user's public profile
// ══════════════════════════════════════════════════════
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name age gender ecole city budget bio traits photo isOnline lastSeen');

    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });

    // Calculate compatibility with current user
    const currentUser = await User.findById(req.user._id);
    const { score, label, breakdown, reasons } = require('../utils/matching').calculateCompatibility(currentUser, user);

    res.json({
      success: true,
      user,
      compatibility: { score, label, breakdown, reasons },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ══════════════════════════════════════════════════════
// POST /api/users/favorites/:annonceId  — toggle favorite
// ══════════════════════════════════════════════════════
router.post('/favorites/:annonceId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { annonceId } = req.params;

    const idx = user.favorites.findIndex((favId) => String(favId) === String(annonceId));
    let action;
    if (idx === -1) {
      user.favorites.push(annonceId);
      action = 'added';
    } else {
      user.favorites.splice(idx, 1);
      action = 'removed';
    }

    await user.save({ validateBeforeSave: false });
    res.json({ success: true, action, favorites: user.favorites.map((id) => String(id)) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ══════════════════════════════════════════════════════
// PUT /api/users/password  — change password
// ══════════════════════════════════════════════════════
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Ancien et nouveau mot de passe requis.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Nouveau mot de passe: minimum 6 caractères.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Mot de passe mis à jour.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;