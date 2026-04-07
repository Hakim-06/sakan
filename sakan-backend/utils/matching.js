/**
 * ═══════════════════════════════════════════════════════════════
 * SAKANCAMPUS — MATCHING AI ENGINE
 * Calcule un score de compatibilité entre deux profils (0–100)
 * ═══════════════════════════════════════════════════════════════
 *
 * Critères pondérés:
 *  - Budget compatible           25 pts
 *  - Ville identique             20 pts
 *  - Traits communs              25 pts
 *  - Genre accepté               15 pts
 *  - Profil complet              10 pts
 *  - Activité récente             5 pts
 */

const normalizeText = (value = '') => String(value).trim().toLowerCase();

/**
 * Calcule la compatibilité budgétaire.
 * 25 pts si les budgets sont proches, 0 si gap > 80%
 */
const scoreBudget = (budgetA, budgetB) => {
  if (!budgetA || !budgetB) return 0;
  const diff = Math.abs(budgetA - budgetB);
  const avg  = (budgetA + budgetB) / 2;
  const gapRatio = diff / avg;

  if (gapRatio <= 0.10) return 20;      // ≤10% écart → parfait
  if (gapRatio <= 0.25) return 15;      // ≤25% → très bon
  if (gapRatio <= 0.50) return 9;       // ≤50% → moyen
  if (gapRatio <= 0.80) return 4;       // ≤80% → faible
  return 0;
};

/**
 * Calcule la compatibilité de localisation.
 * 20 pts si même ville, 5 pts si ville différente (peut déménager)
 */
const scoreCity = (cityA, cityB) => {
  if (!cityA || !cityB) return 0;
  return normalizeText(cityA) === normalizeText(cityB) ? 15 : 4;
};

/**
 * Calcule la compatibilité école / campus.
 */
const scoreSchool = (schoolA, schoolB, cityA, cityB) => {
  if (!schoolA || !schoolB) return { score: 0, reason: null };

  if (normalizeText(schoolA) === normalizeText(schoolB)) {
    return { score: 10, reason: 'Même école.' };
  }

  if (normalizeText(cityA) && normalizeText(cityA) === normalizeText(cityB)) {
    return { score: 5, reason: 'Même ville d’études.' };
  }

  return { score: 0, reason: null };
};

/**
 * Calcule la compatibilité de traits.
 * 25 pts max basé sur le % de traits communs
 */
const scoreTraits = (traitsA = [], traitsB = []) => {
  if (!traitsA.length || !traitsB.length) return 0;

  const common = traitsA.filter(t => traitsB.includes(t)).length;
  const total  = new Set([...traitsA, ...traitsB]).size;
  const similarity = common / total; // Jaccard similarity

  return Math.round(similarity * 15);
};

/**
 * Score de style de vie basé sur les traits de coloc.
 * Couvre les signaux importants: couche-tard / lève-tôt, calme / fêtard,
 * maniaque / tolérance, studieux / sportif.
 */
const scoreLifestyle = (traitsA = [], traitsB = []) => {
  const a = new Set(traitsA);
  const b = new Set(traitsB);
  let score = 0;
  const reasons = [];

  const pair = (trait, points, reason) => {
    if (a.has(trait) && b.has(trait)) {
      score += points;
      reasons.push(reason);
    }
  };

  pair('Calme', 3, 'Vous cherchez tous les deux un environnement calme.');
  pair('Studieux', 4, 'Les deux profils sont orientés travail / études.');
  pair('Maniaque', 3, 'Même niveau d’exigence sur l’ordre et la propreté.');
  pair('Sportif', 2, 'Même rythme de vie actif.');
  pair('Gamer', 1, 'Centres d’intérêt communs sur les loisirs.');
  pair('Couche-tard', 3, 'Horaires de sommeil compatibles.');
  pair('Lève-tôt', 3, 'Rythme de réveil compatible.');
  pair('Fêtard', 2, 'Vie sociale compatible.');

  if (a.has('Couche-tard') && b.has('Lève-tôt')) {
    score -= 4;
    reasons.push('Horaires de sommeil potentiellement opposés.');
  }
  if (a.has('Lève-tôt') && b.has('Couche-tard')) {
    score -= 4;
    reasons.push('Horaires de sommeil potentiellement opposés.');
  }
  if (a.has('Maniaque') && b.has('Fêtard')) {
    score -= 2;
    reasons.push('Rythme de vie probablement moins aligné.');
  }
  if (a.has('Fêtard') && b.has('Calme')) {
    score -= 2;
    reasons.push('Rythmes sociaux différents.');
  }

  return { score: Math.max(-5, Math.min(15, score)), reasons };
};

/**
 * Calcule la compatibilité de genre.
 * 15 pts si compatible, 0 si incompatible
 */
const scoreGender = (genderA, genderB, prefA, prefB) => {
  if (!genderA || !genderB) return 8; // neutre si non renseigné

  const aAcceptsB = !prefA || prefA === 'Peu importe' || prefA === genderB;
  const bAcceptsA = !prefB || prefB === 'Peu importe' || prefB === genderA;

  if (aAcceptsB && bAcceptsA) return 10;
  if (aAcceptsB || bAcceptsA) return 5;
  return 0;
};

/**
 * Bonus profil complet (10 pts) + activité récente (5 pts)
 */
const scoreBonuses = (userB) => {
  let bonus = 0;
  if (userB.profileComplete) bonus += 3;

  if (userB.lastSeen) {
    const hoursSince = (Date.now() - new Date(userB.lastSeen)) / (1000 * 3600);
    if (hoursSince < 24)  bonus += 2;  // actif aujourd'hui
    else if (hoursSince < 72) bonus += 1; // actif cette semaine
  }
  return bonus;
};

/**
 * Compatibilité des règles de coloc.
 * Les préférences sont traitées comme des signaux de compatibilité,
 * pas comme des blocages stricts.
 */
const scoreRoommateRules = (prefsA = {}, prefsB = {}) => {
  let score = 0;
  const reasons = [];

  if (prefsA.genderPref && prefsB.genderPref) {
    if (prefsA.genderPref === 'Peu importe' || prefsB.genderPref === 'Peu importe') {
      score += 3;
      reasons.push('Préférences de genre flexibles.');
    } else if (prefsA.genderPref === prefsB.genderPref) {
      score += 5;
      reasons.push('Même préférence de coloc.');
    }
  }

  const ruleChecks = [
    ['smokingOk', 2, 'Vision similaire sur le tabac.'],
    ['petsOk', 1, 'Vision similaire sur les animaux.'],
    ['visitorsOk', 2, 'Vision similaire sur les visites.'],
  ];

  ruleChecks.forEach(([key, points, reason]) => {
    if (prefsA[key] === prefsB[key]) {
      score += points;
      reasons.push(reason);
    }
  });

  return { score: Math.max(0, Math.min(10, score)), reasons };
};

/**
 * Calcule la compatibilité d'une annonce avec l'utilisateur connecté.
 * Utilise les mêmes signaux qu'un matching utilisateur, mais compare
 * le profil du visiteur avec le logement + le propriétaire de l'annonce.
 */
const calculateAnnonceCompatibility = (currentUser, annonce) => {
  const owner = annonce.owner || {};

  const budget = scoreBudget(currentUser.budget, annonce.budget);
  const city = scoreCity(currentUser.city, annonce.city);
  const school = scoreSchool(currentUser.ecole, owner.ecole, currentUser.city, owner.city);
  const traits = scoreTraits(currentUser.traits, owner.traits);
  const lifestyle = scoreLifestyle(currentUser.traits, owner.traits);
  const gender = scoreGender(
    currentUser.gender,
    owner.gender,
    currentUser.preferences?.genderPref,
    owner.preferences?.genderPref,
  );
  const roommateRules = scoreRoommateRules(currentUser.preferences, owner.preferences);
  const bonuses = scoreBonuses(owner);

  const total = Math.min(100, budget + city + school.score + traits + lifestyle.score + gender + roommateRules.score + bonuses);

  let label;
  if (total >= 85) label = 'Excellent match';
  else if (total >= 70) label = 'Très compatible';
  else if (total >= 55) label = 'Compatible';
  else if (total >= 40) label = 'Peu compatible';
  else label = 'Incompatible';

  return {
    score: total,
    label,
    breakdown: {
      budget,
      city,
      school: school.score,
      traits,
      lifestyle: lifestyle.score,
      gender,
      roommateRules: roommateRules.score,
      bonuses,
    },
    reasons: [
      ...(city === 20 ? ['Même ville cible.'] : city > 0 ? ['Ville proche, déplacement possible.'] : []),
      ...(budget >= 20 ? ['Budget bien aligné.'] : budget > 0 ? ['Budget acceptable.'] : []),
      ...(school.reason ? [school.reason] : []),
      ...lifestyle.reasons,
      ...roommateRules.reasons,
    ].slice(0, 4),
  };
};

const buildAnnonceMatchPayload = (currentUser, annonce) => {
  const annonceObj = typeof annonce.toObject === 'function' ? annonce.toObject() : annonce;
  const owner = annonceObj.owner || {};

  const compatibleAnnonce = {
    ...annonceObj,
    gender: owner.gender,
    traits: owner.traits || [],
    preferences: owner.preferences || {},
    ecole: owner.ecole,
    city: owner.city,
    profileComplete: owner.profileComplete,
    lastSeen: owner.lastSeen,
  };

  const { score, label, breakdown, reasons } = calculateAnnonceCompatibility(currentUser, compatibleAnnonce);
  return { ...annonceObj, matchScore: score, matchLabel: label, matchBreakdown: breakdown, matchReasons: reasons };
};

/**
 * ─── MAIN FUNCTION ─────────────────────────────────────────────
 * @param {Object} userA - profil de l'utilisateur connecté
 * @param {Object} userB - profil à comparer
 * @returns {Object} { score, breakdown, label }
 */
const calculateCompatibility = (userA, userB) => {
  const budget  = scoreBudget(userA.budget, userB.budget);
  const city    = scoreCity(userA.city, userB.city);
  const school  = scoreSchool(userA.ecole, userB.ecole, userA.city, userB.city);
  const traits  = scoreTraits(userA.traits, userB.traits);
  const lifestyle = scoreLifestyle(userA.traits, userB.traits);
  const gender  = scoreGender(
    userA.gender, userB.gender,
    userA.preferences?.genderPref, userB.preferences?.genderPref
  );
  const roommateRules = scoreRoommateRules(userA.preferences, userB.preferences);
  const bonuses = scoreBonuses(userB);

  const total = Math.min(100, budget + city + school.score + traits + lifestyle.score + gender + roommateRules.score + bonuses);

  // Label de compatibilité
  let label;
  if (total >= 85) label = 'Excellent match';
  else if (total >= 70) label = 'Très compatible';
  else if (total >= 55) label = 'Compatible';
  else if (total >= 40) label = 'Peu compatible';
  else label = 'Incompatible';

  return {
    score: total,
    label,
    breakdown: {
      budget,
      city,
      school: school.score,
      traits,
      lifestyle: lifestyle.score,
      gender,
      roommateRules: roommateRules.score,
      bonuses,
    },
    reasons: [
      ...(school.reason ? [school.reason] : []),
      ...lifestyle.reasons,
      ...roommateRules.reasons,
    ].slice(0, 3),
  };
};

/**
 * ─── SORT FEED BY COMPATIBILITY ────────────────────────────────
 * Enrichit une liste d'utilisateurs avec leur score de compatibilité
 * et les trie du meilleur au moins bon.
 * @param {Object} currentUser - utilisateur connecté
 * @param {Array}  users       - liste des autres profils
 * @returns {Array} profils enrichis et triés
 */
const sortByCompatibility = (currentUser, users) => {
  return users
    .map(user => {
      const userObj = typeof user.toObject === 'function' ? user.toObject() : user;
      const { score, label, breakdown, reasons } = calculateCompatibility(currentUser, userObj);
      return { ...userObj, matchScore: score, matchLabel: label, matchBreakdown: breakdown, matchReasons: reasons };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};

const sortAnnoncesByCompatibility = (currentUser, annonces) => {
  return annonces
    .map(annonce => buildAnnonceMatchPayload(currentUser, annonce))
    .sort((a, b) => b.matchScore - a.matchScore);
};

module.exports = {
  calculateCompatibility,
  calculateAnnonceCompatibility,
  sortByCompatibility,
  sortAnnoncesByCompatibility,
};