const express = require('express');
const { protect } = require('../middleware/auth');
// ZEDNA L-PACKAGE DYAL GOOGLE HNA 👇
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

const detectResponseStyle = (message = '') => {
  const q = message.toLowerCase();
  const hasArabicChars = /[\u0600-\u06FF]/.test(message);
  const hasDarijaWords = /(chno|bghit|kifach|wach|mzyan|fin|3la|bzaf|safi|khoya|kayn)/.test(q);

  if (hasArabicChars || hasDarijaWords) {
    return 'Darija marocaine en caracteres latins, ton naturel, direct, comme l\'utilisateur';
  }

  return 'Meme langue et meme ton que l\'utilisateur, avec style simple et direct';
};

const buildRecommendations = (safeContext) => {
  const listings = Array.isArray(safeContext.listingsSample) ? safeContext.listingsSample : [];
  const preferredBudget = Number(safeContext?.userProfile?.budget) || 0;
  const preferredCity = (safeContext?.userProfile?.city || '').toLowerCase();

  const scored = listings
    .filter((l) => Number(l.budget) > 0)
    .map((l) => {
      const budget = Number(l.budget) || 0;
      const budgetGap = preferredBudget > 0 ? Math.abs(budget - preferredBudget) : 0;
      const cityBonus = preferredCity && String(l.city || '').toLowerCase() === preferredCity ? 12 : 0;
      const match = Number(l.matchScore) || 0;
      const score = match + cityBonus - Math.min(20, Math.round(budgetGap / 150));
      return { ...l, _score: score };
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, 3)
    .map((l) => ({
      city: l.city,
      budget: l.budget,
      ecole: l.ecole,
      matchScore: l.matchScore,
      amenities: l.amenities || [],
    }));

  return scored;
};

const buildLocalChatFallback = (message, safeContext) => {
  const style = detectResponseStyle(message);
  const q = String(message || '').toLowerCase();
  const topCities = safeContext.topCities?.length ? safeContext.topCities.join(', ') : 'non disponible';
  const min = safeContext.priceSummary?.min || 'n/a';
  const avg = safeContext.priceSummary?.avg || 'n/a';
  const max = safeContext.priceSummary?.max || 'n/a';
  const budget = safeContext.userProfile?.budget || 'n/a';

  if (style.includes('Darija')) {
    if (q.includes('prix') || q.includes('budget')) {
      return `Daba men data li 3andi: min ${min} DH, moyenne ${avg} DH, max ${max} DH. Ila budget dyalk ${budget} DH, bda b range qrib men had l7doud.`;
    }
    if (q.includes('ville') || q.includes('madina') || q.includes('city')) {
      return `Top lmdin li baynin daba: ${topCities}. Ila bghiti, n9ed nرشح lik wa7da 3la hsab budget dyalk.`;
    }
    if (q.includes('matching') || q.includes('compat')) {
      return `Seuil dyal matching daba هو ${safeContext.matchingThreshold}%, w kaynin ${safeContext.visibleCount} annonces visibles. Ila bghiti natl3o quality khtar 70%+.`;
    }
    return `Kayn daba ${safeContext.visibleCount} annonces visibles. Qdar tsowwlni 3la prix, mdina, matching, ola filters w n3tik kholasa sريعة.`;
  }

  if (q.includes('prix') || q.includes('budget')) {
    return `Resume prix actuel: min ${min} DH, moyenne ${avg} DH, max ${max} DH. Avec un budget utilisateur de ${budget} DH, vise d'abord les annonces autour de cette moyenne.`;
  }
  if (q.includes('ville') || q.includes('city')) {
    return `Villes les plus presentes actuellement: ${topCities}. Je peux ensuite te proposer une selection selon ton budget.`;
  }
  if (q.includes('matching') || q.includes('compat')) {
    return `Seuil de matching actuel: ${safeContext.matchingThreshold}%. Nombre d'annonces visibles: ${safeContext.visibleCount}. Pour plus de qualite, reste a 70% ou plus.`;
  }
  return `Tu as ${safeContext.visibleCount} annonces visibles pour le moment. Pose-moi une question precise (prix, ville, matching, filtres) et je te reponds directement.`;
};

const getGeminiClient = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY manqosa.');
  }
  return new GoogleGenerativeAI(key);
};

const generateWithGeminiModels = async (prompt) => {
  const genAI = getGeminiClient();
  const preferredModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const candidates = [
    preferredModel,
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
  ].filter(Boolean);
  const uniqueCandidates = [...new Set(candidates)];

  let lastErr = null;
  for (const modelName of uniqueCandidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      if (text) return { text, mode: `gemini:${modelName}` };
      throw new Error(`Reponse vide depuis ${modelName}`);
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr || new Error('Generation IA impossible.');
};

const generateWithOpenAI = async (prompt) => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error('OPENAI_API_KEY manqosa.');
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        messages: [
          {
            role: 'system',
            content: 'Tu es Sakan AI. Reponses courtes, utiles, concretes, et orientees logement etudiant au Maroc.',
          },
          { role: 'user', content: prompt },
        ],
      }),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const apiMsg = data?.error?.message || `OpenAI HTTP ${response.status}`;
      throw new Error(apiMsg);
    }

    const text = String(data?.choices?.[0]?.message?.content || '').trim();
    if (!text) {
      throw new Error(`Reponse vide depuis ${model}`);
    }

    return { text, mode: `openai:${model}` };
  } finally {
    clearTimeout(timeout);
  }
};

const generateWithProviders = async (prompt) => {
  const provider = String(process.env.AI_PROVIDER || 'auto').toLowerCase();
  const pipelines =
    provider === 'openai'
      ? [generateWithOpenAI, generateWithGeminiModels]
      : provider === 'gemini'
        ? [generateWithGeminiModels, generateWithOpenAI]
        : [generateWithOpenAI, generateWithGeminiModels];

  let lastErr = null;
  for (const run of pipelines) {
    try {
      return await run(prompt);
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr || new Error('Generation IA impossible.');
};

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

    const { text: bio } = await generateWithProviders(prompt);

    if (!bio) throw new Error('Réponse Gemini vide');

    res.json({ success: true, bio });

  } catch (err) {
    console.error('AI BIO ERROR:', err.message);
    res.status(500).json({ success: false, message: 'Service IA indisponible pour le moment.' });
  }
});

// ══════════════════════════════════════════════════════
// POST /api/ai/chat  — assistant chat général (Gemini)
// ══════════════════════════════════════════════════════
router.post('/chat', protect, async (req, res) => {
  let message = '';
  let requestContext = {};
  try {
    message = String(req.body?.message || '');
    requestContext = req.body?.context || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message requis.' });
    }

    const safeContext = {
      city: requestContext.city || 'non precise',
      priceMin: requestContext.priceMin || '',
      priceMax: requestContext.priceMax || '',
      matchingThreshold: Number(requestContext.matchingThreshold) || 70,
      visibleCount: Number(requestContext.visibleCount) || 0,
      topCities: Array.isArray(requestContext.topCities) ? requestContext.topCities.slice(0, 6) : [],
      priceSummary: {
        min: Number(requestContext?.priceSummary?.min) || null,
        max: Number(requestContext?.priceSummary?.max) || null,
        avg: Number(requestContext?.priceSummary?.avg) || null,
      },
      listingsSample: Array.isArray(requestContext.listingsSample)
        ? requestContext.listingsSample.slice(0, 12).map((item) => ({
            city: item?.city || '',
            budget: Number(item?.budget) || 0,
            ecole: item?.ecole || '',
            matchScore: Number(item?.matchScore) || 0,
            amenities: Array.isArray(item?.amenities) ? item.amenities.slice(0, 4) : [],
          }))
        : [],
      userProfile: {
        city: requestContext?.userProfile?.city || '',
        budget: Number(requestContext?.userProfile?.budget) || 0,
        traits: Array.isArray(requestContext?.userProfile?.traits) ? requestContext.userProfile.traits.slice(0, 8) : [],
      },
    };

    const responseStyle = detectResponseStyle(message);
    const topRecommendations = buildRecommendations(safeContext);

    const prompt = `
Tu es Sakan AI, assistant logement pour etudiants au Maroc.
Style: utile, moderne, concret, tres pratique.
Langue de reponse: ${responseStyle}.
Regles:
- Commence par detecter la langue/ton du message utilisateur et reponds dans le meme style (mirroring).
- Si l\'utilisateur parle en darija (latin), reponds en darija (latin), pas en francais soutenu.
- Reponds en format clair: 1) Analyse rapide 2) Meilleures options 3) Action conseillee.
- Sois pratique (prix, ville, matching, filtres) et base-toi sur les donnees ci-dessous.
- Ne donne pas de contenu dangereux.
- Si possible, cite 2-3 options concretes basees sur les annonces visibles.
- Evite les generalites. Si info manquante, dis-le clairement en une phrase.

Contexte utilisateur:
- Ville filtre: ${safeContext.city}
- Prix min: ${safeContext.priceMin || 'non defini'}
- Prix max: ${safeContext.priceMax || 'non defini'}
- Seuil matching: ${safeContext.matchingThreshold}
- Nombre annonces visibles: ${safeContext.visibleCount}
- Top villes: ${safeContext.topCities.join(', ') || 'non disponible'}
- Resume prix annonces visibles: min=${safeContext.priceSummary.min || 'n/a'} DH, moyenne=${safeContext.priceSummary.avg || 'n/a'} DH, max=${safeContext.priceSummary.max || 'n/a'} DH
- Profil utilisateur: ville=${safeContext.userProfile.city || 'n/a'}, budget=${safeContext.userProfile.budget || 'n/a'} DH, traits=${safeContext.userProfile.traits.join(', ') || 'n/a'}
- Exemples annonces visibles (JSON): ${JSON.stringify(safeContext.listingsSample)}
- Top recommandations pre-calculees (JSON): ${JSON.stringify(topRecommendations)}

Question utilisateur:
${message.trim()}
`.trim();

    const { text: answer, mode } = await generateWithProviders(prompt);

    if (!answer) {
      throw new Error('Reponse IA vide');
    }

    res.json({ success: true, answer, mode });
  } catch (err) {
    const msg = String(err?.message || 'Erreur IA inconnue');
    console.error('AI CHAT ERROR:', msg);

    const fallbackContext = {
      city: requestContext?.city || 'non precise',
      priceMin: requestContext?.priceMin || '',
      priceMax: requestContext?.priceMax || '',
      matchingThreshold: Number(requestContext?.matchingThreshold) || 70,
      visibleCount: Number(requestContext?.visibleCount) || 0,
      topCities: Array.isArray(requestContext?.topCities) ? requestContext.topCities.slice(0, 6) : [],
      priceSummary: {
        min: Number(requestContext?.priceSummary?.min) || null,
        max: Number(requestContext?.priceSummary?.max) || null,
        avg: Number(requestContext?.priceSummary?.avg) || null,
      },
      userProfile: {
        budget: Number(requestContext?.userProfile?.budget) || 0,
      },
    };

    const fallbackAnswer = buildLocalChatFallback(message, fallbackContext);
    return res.status(200).json({
      success: true,
      answer: fallbackAnswer,
      mode: 'fallback-local',
    });
  }
});

module.exports = router;