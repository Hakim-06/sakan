const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const verifyTokenWithFallbackSecrets = (token) => {
  const primary = process.env.JWT_SECRET;
  const legacyPrefixed = primary ? `JWT_SECRET=${primary}` : '';
  const legacyEnv = process.env.JWT_SECRET_LEGACY || '';
  const candidates = [primary, legacyEnv, legacyPrefixed].filter(Boolean);

  let lastError = null;
  for (const secret of candidates) {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Token invalide.');
};

// ─── Protect route — require valid JWT ───────────────
const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Accès refusé. Token manquant.' });
    }

    const token = auth.split(' ')[1];
    const decoded = verifyTokenWithFallbackSecrets(token);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Utilisateur introuvable.' });
    }

    const now = new Date();
    const shouldTouchPresence =
      !user.isOnline ||
      !user.lastSeen ||
      (now.getTime() - new Date(user.lastSeen).getTime()) > 60 * 1000;

    if (shouldTouchPresence) {
      user.isOnline = true;
      user.lastSeen = now;
      await user.save({ validateBeforeSave: false });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expiré. Reconnecte-toi.' });
    }
    return res.status(401).json({ success: false, message: 'Token invalide.' });
  }
};

// ─── Generate JWT helper ──────────────────────────────
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = { protect, generateToken };
