const express = require('express');
const { protect } = require('../middleware/auth');
// ZEDNA L-PACKAGE DYAL GOOGLE HNA 👇
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// ══════════════════════════════════════════════════════
// POST /api/ai/bio  — génère une bio avec Gemini (Nouvelle méthode SDK)
// ══════════════════════════════════════════════════════
router.post('/bio', protect, async (req, res) => {
  try {
    const { name, age, gender, ecole, traits } = req.body;

    if (!name || !traits || traits.length === 0) {
      return res.status(400).json({ success: false, message: 'Nom et traits requis.' });
    }

    const prompt = `Écris une bio courte (max 3 phrases) pour un profil de colocation étudiant au Maroc.
Nom: ${name}, Âge: ${age || '?'}, Genre: ${gender || 'non précisé'}, École: ${ecole || 'non précisé'}.
Traits de caractère: ${traits.join(', ')}.
Ton: sympa, naturel, moderne, donne envie de vivre avec cette personne.
Réponds UNIQUEMENT avec le texte de la bio, sans guillemets, sans introduction.`;

    // 1. Initialiser Gemini m3a l-API_KEY dyalk
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 2. Khtar l-modèle (Hada howa jdid w zreb w k-t9belo Google dima)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Générer l-Bio
    const result = await model.generateContent(prompt);
    const bio = result.response.text().trim();

    if (!bio) throw new Error('Réponse Gemini vide');

    res.json({ success: true, bio });

  } catch (err) {
    console.error('AI BIO ERROR:', err.message);
    res.status(500).json({ success: false, message: 'Erreur IA: ' + err.message });
  }
});

module.exports = router;