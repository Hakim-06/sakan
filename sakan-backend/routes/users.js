const express = require('express');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');
const { sortByCompatibility } = require('../utils/matching');

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

    // Validate traits array (max 4)
    if (updates.traits && updates.traits.length > 4) {
      return res.status(400).json({ success: false, message: 'Maximum 4 traits autorisés.' });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    user.checkProfileComplete();
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, user });
  } catch (err) {
    console.error('PROFILE UPDATE ERROR:', err);
    res.status(400).json({ success: false, message: err.message });
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
    const { score, label, breakdown } = require('../utils/matching').calculateCompatibility(currentUser, user);

    res.json({
      success: true,
      user,
      compatibility: { score, label, breakdown },
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

    const idx = user.favorites.indexOf(annonceId);
    let action;
    if (idx === -1) {
      user.favorites.push(annonceId);
      action = 'added';
    } else {
      user.favorites.splice(idx, 1);
      action = 'removed';
    }

    await user.save({ validateBeforeSave: false });
    res.json({ success: true, action, favorites: user.favorites });
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