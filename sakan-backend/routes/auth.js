const express   = require('express');
const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const User      = require('../models/User');
const { protect, generateToken } = require('../middleware/auth');
const { sendEmail } = require('../utils/mailer');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const EMAIL_CODE_TTL_MS = 10 * 60 * 1000;
const EMAIL_CODE_RESEND_COOLDOWN_MS = 60 * 1000;
const EMAIL_CODE_MAX_ATTEMPTS = 5;
const RESET_CODE_TTL_MS = 10 * 60 * 1000;

const generateEmailOtpCode = () => String(Math.floor(100000 + Math.random() * 900000));
const hashOtp = (value) => crypto.createHash('sha256').update(String(value)).digest('hex');

const buildVerifyEmailHtml = (name, code) => `
  <div style="margin:0;padding:24px 0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
      <tr>
        <td style="padding:20px 22px;background:linear-gradient(135deg,#ea580c,#f97316);color:#fff;">
          <div style="font-size:20px;font-weight:800;letter-spacing:0.2px;">SakanCampus</div>
          <div style="margin-top:4px;font-size:12px;opacity:0.92;">Verification de compte</div>
        </td>
      </tr>
      <tr>
        <td style="padding:22px;">
          <p style="margin:0 0 10px;font-size:15px;line-height:1.6;">Bonjour ${name || ''},</p>
          <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#334155;">Merci pour ton inscription. Utilise ce code pour verifier ton email et activer ton compte.</p>
          <div style="margin:0 0 14px;padding:14px 12px;border:1px dashed #fdba74;border-radius:10px;background:#fff7ed;text-align:center;">
            <div style="font-size:28px;line-height:1;font-weight:900;letter-spacing:6px;color:#9a3412;">${code}</div>
          </div>
          <p style="margin:0 0 10px;font-size:13px;color:#475569;">Ce code expire dans <strong>10 minutes</strong>.</p>
          <p style="margin:0;font-size:12px;color:#94a3b8;">Si tu n'as pas demande ce code, ignore simplement ce message.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 22px 18px;border-top:1px solid #f1f5f9;font-size:11px;color:#94a3b8;">
          SakanCampus - Plateforme de colocation etudiante
        </td>
      </tr>
    </table>
  </div>
`;

const buildResetPasswordHtml = (name, code) => `
  <div style="margin:0;padding:24px 0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
      <tr>
        <td style="padding:20px 22px;background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;">
          <div style="font-size:20px;font-weight:800;letter-spacing:0.2px;">SakanCampus</div>
          <div style="margin-top:4px;font-size:12px;opacity:0.92;">Réinitialisation mot de passe</div>
        </td>
      </tr>
      <tr>
        <td style="padding:22px;">
          <p style="margin:0 0 10px;font-size:15px;line-height:1.6;">Bonjour ${name || ''},</p>
          <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#334155;">Utilise ce code pour réinitialiser ton mot de passe.</p>
          <div style="margin:0 0 14px;padding:14px 12px;border:1px dashed #93c5fd;border-radius:10px;background:#eff6ff;text-align:center;">
            <div style="font-size:28px;line-height:1;font-weight:900;letter-spacing:6px;color:#1d4ed8;">${code}</div>
          </div>
          <p style="margin:0 0 10px;font-size:13px;color:#475569;">Ce code expire dans <strong>10 minutes</strong>.</p>
          <p style="margin:0;font-size:12px;color:#94a3b8;">Si ce n'est pas toi, ignore cet email.</p>
        </td>
      </tr>
    </table>
  </div>
`;

const buildFrontendUrl = (req) => {
  const forwardedHost = req?.headers?.['x-forwarded-host'];
  const host = forwardedHost || req?.headers?.host;
  if (host) return `https://${host.replace(/\/$/, '')}`;

  const envUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL;
  if (envUrl) return String(envUrl).replace(/\/$/, '');

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;

  return 'http://localhost:5173';
};

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
  body('newPassword').isLength({ min: 6 }).withMessage('Mot de passe: minimum 6 caractères'),
  body().custom((value) => {
    const hasToken = Boolean(value?.token);
    const hasCodeFlow = Boolean(value?.email && value?.code);
    if (!hasToken && !hasCodeFlow) {
      throw new Error('Token ou email+code requis');
    }
    return true;
  }),
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

    const otpCode = generateEmailOtpCode();
    const otpHash = hashOtp(otpCode);
    const expiresAt = new Date(Date.now() + EMAIL_CODE_TTL_MS);

    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      emailVerifyToken: null,
      emailVerifyTokenExpires: null,
      emailVerifyCodeHash: otpHash,
      emailVerifyCodeExpires: expiresAt,
      emailVerifyCodeAttempts: 0,
      emailVerifyLastSentAt: new Date(),
    });

    let mailResult = { sent: false, reason: 'unknown' };
    try {
      mailResult = await sendEmail({
        to: email,
        subject: 'Code de vérification - SakanCampus',
        text: `Ton code de vérification SakanCampus: ${otpCode} (expire dans 10 minutes).`,
        html: buildVerifyEmailHtml(name, otpCode),
      });
    } catch (mailErr) {
      console.error('REGISTER EMAIL ERROR:', mailErr?.message || mailErr);
      mailResult = { sent: false, reason: mailErr?.message || 'smtp error' };
    }

    const response = {
      success: true,
      message: mailResult.sent
        ? 'Compte créé. Entre le code reçu par email pour activer ton accès.'
        : 'Compte créé. Service email indisponible pour le moment.',
      requiresEmailVerification: true,
      verificationMethod: 'code',
      email,
      expiresAt,
    };

    if (!mailResult.sent) {
      if (process.env.NODE_ENV === 'production') {
        response.message = 'Compte créé, mais l\'envoi du code a échoué. Réessaie "Renvoyer le code" dans un instant.';
      } else {
        response.devVerificationCode = otpCode;
        response.message = 'Mode dev: code de vérification généré (SMTP non configuré).';
      }
    }

    return res.status(201).json(response);

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
// POST /api/auth/verify-email-code
// ══════════════════════════════════════════════════════
router.post('/verify-email-code', [
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Code invalide'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const code = String(req.body.code || '').trim();
    const user = await User.findOne({ email }).select('+emailVerifyCodeHash +emailVerifyCodeExpires +emailVerifyCodeAttempts');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Cet email n\'existe pas.' });
    }
    if (user.isVerified) {
      return res.json({ success: true, message: 'Email déjà vérifié.' });
    }
    if (!user.emailVerifyCodeHash || !user.emailVerifyCodeExpires || user.emailVerifyCodeExpires <= new Date()) {
      return res.status(400).json({ success: false, message: 'Code expiré. Demande un nouveau code.' });
    }
    if ((user.emailVerifyCodeAttempts || 0) >= EMAIL_CODE_MAX_ATTEMPTS) {
      return res.status(429).json({ success: false, message: 'Trop de tentatives. Demande un nouveau code.' });
    }

    const isValid = hashOtp(code) === user.emailVerifyCodeHash;
    if (!isValid) {
      user.emailVerifyCodeAttempts = (user.emailVerifyCodeAttempts || 0) + 1;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({ success: false, message: 'Code incorrect.' });
    }

    user.isVerified = true;
    user.emailVerifyToken = null;
    user.emailVerifyTokenExpires = null;
    user.emailVerifyCodeHash = null;
    user.emailVerifyCodeExpires = null;
    user.emailVerifyCodeAttempts = 0;
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    return res.json({
      success: true,
      message: 'Email vérifié avec succès. Connexion automatique effectuée.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err) {
    console.error('VERIFY EMAIL CODE ERROR:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la vérification du code.' });
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
    const user = await User.findOne({ email }).select('+emailVerifyCodeHash +emailVerifyCodeExpires +emailVerifyCodeAttempts +emailVerifyLastSentAt');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Cet email n\'existe pas.' });
    }

    if (user.isVerified) {
      return res.status(409).json({ success: false, message: 'Cet email est déjà vérifié.' });
    }

    const now = Date.now();
    const lastSentMs = user.emailVerifyLastSentAt ? new Date(user.emailVerifyLastSentAt).getTime() : 0;
    const remainingCooldown = EMAIL_CODE_RESEND_COOLDOWN_MS - (now - lastSentMs);
    if (remainingCooldown > 0) {
      return res.status(429).json({
        success: false,
        message: `Attends ${Math.ceil(remainingCooldown / 1000)}s avant de renvoyer un nouveau code.`,
      });
    }

    const otpCode = generateEmailOtpCode();
    const otpHash = hashOtp(otpCode);
    const expiresAt = new Date(now + EMAIL_CODE_TTL_MS);

    user.emailVerifyCodeHash = otpHash;
    user.emailVerifyCodeExpires = expiresAt;
    user.emailVerifyCodeAttempts = 0;
    user.emailVerifyLastSentAt = new Date(now);
    await user.save({ validateBeforeSave: false });

    const mailResult = await sendEmail({
      to: email,
      subject: 'Nouveau code de vérification - SakanCampus',
      text: `Ton nouveau code de vérification SakanCampus: ${otpCode} (expire dans 10 minutes).`,
      html: buildVerifyEmailHtml(user.name, otpCode),
    });

    if (!mailResult.sent && process.env.NODE_ENV === 'production') {
      return res.status(503).json({ success: false, message: 'Service email indisponible. Réessaie plus tard.' });
    }

    const response = {
      success: true,
      message: 'Nouveau code envoyé. Vérifie ta boîte mail.',
      expiresAt,
      verificationMethod: 'code',
    };

    if (!mailResult.sent && process.env.NODE_ENV !== 'production') {
      response.devVerificationCode = otpCode;
      response.message = 'SMTP non configuré. Utilise le code de dev pour vérifier le compte.';
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

    const resetCode = generateEmailOtpCode();
    const tokenHash = hashOtp(resetCode);
    const expiresAt = new Date(Date.now() + RESET_CODE_TTL_MS);

    user.passwordResetToken = tokenHash;
    user.passwordResetTokenExpires = expiresAt;
    await user.save({ validateBeforeSave: false });

    const mailResult = await sendEmail({
      to: email,
      subject: 'Code de réinitialisation - SakanCampus',
      text: `Ton code de réinitialisation SakanCampus: ${resetCode} (expire dans 10 minutes).`,
      html: buildResetPasswordHtml(user.name, resetCode),
    });

    if (!mailResult.sent && process.env.NODE_ENV === 'production') {
      return res.status(503).json({ success: false, message: 'Service email indisponible. Réessaie plus tard.' });
    }

    const response = {
      success: true,
      message: 'Un code de réinitialisation a été envoyé à ton email.',
      expiresAt,
    };

    if (!mailResult.sent && process.env.NODE_ENV !== 'production') {
      response.devResetCode = resetCode;
      response.message = 'SMTP non configuré. Utilise le code de dev pour réinitialiser.';
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
    const { token, email, code, newPassword } = req.body;
    const tokenHash = token ? hashOtp(token) : null;
    const codeHash = code ? hashOtp(code) : null;

    const query = {
      passwordResetTokenExpires: { $gt: new Date() },
    };

    if (tokenHash) {
      query.passwordResetToken = tokenHash;
    } else {
      query.passwordResetToken = codeHash;
      query.email = String(email || '').trim().toLowerCase();
    }

    const user = await User.findOne(query).select('+password +passwordResetToken +passwordResetTokenExpires');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Code/lien de réinitialisation invalide ou expiré.' });
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