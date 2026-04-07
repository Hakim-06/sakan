const express = require('express');
const { sendEmail, hasSmtpConfig } = require('../utils/mailer');

const router = express.Router();

const escapeHtml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

router.post('/', async (req, res) => {
  try {
    const name = (req.body?.name || '').trim();
    const email = (req.body?.email || '').trim().toLowerCase();
    const subject = (req.body?.subject || '').trim();
    const message = (req.body?.message || '').trim();

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis.',
      });
    }

    if (name.length > 80 || subject.length > 140) {
      return res.status(400).json({
        success: false,
        message: 'Nom ou sujet trop long.',
      });
    }

    if (message.length < 10 || message.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Le message doit contenir entre 10 et 5000 caracteres.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Adresse email invalide.',
      });
    }

    const to = process.env.CONTACT_EMAIL_TO || process.env.SMTP_USER;
    if (!to) {
      return res.status(500).json({
        success: false,
        message: 'Contact email non configure.',
      });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
        <h2 style="margin:0 0 12px;">Nouveau message Contact Us</h2>
        <p><strong>Nom:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Sujet:</strong> ${safeSubject}</p>
        <p><strong>Message:</strong><br/>${safeMessage}</p>
      </div>
    `;

    const text = [
      'Nouveau message Contact Us',
      `Nom: ${name}`,
      `Email: ${email}`,
      `Sujet: ${subject}`,
      'Message:',
      message,
    ].join('\n');

    const result = await sendEmail({
      to,
      subject: `[SakanCampus] Contact: ${subject}`,
      html,
      text,
    });

    if (!result.sent && hasSmtpConfig()) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi du message.',
      });
    }

    if (!result.sent) {
      console.log('[CONTACT][DEV] SMTP non configure, message recu:', {
        name,
        email,
        subject,
        message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Message envoye. Merci, on te repond rapidement.',
    });
  } catch (err) {
    console.error('CONTACT ERROR:', err);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur, reessaie plus tard.',
    });
  }
});

module.exports = router;
