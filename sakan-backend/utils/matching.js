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

/**
 * Calcule la compatibilité budgétaire.
 * 25 pts si les budgets sont proches, 0 si gap > 80%
 */
const scoreBudget = (budgetA, budgetB) => {
  if (!budgetA || !budgetB) return 0;
  const diff = Math.abs(budgetA - budgetB);
  const avg  = (budgetA + budgetB) / 2;
  const gapRatio = diff / avg;

  if (gapRatio <= 0.10) return 25;      // ≤10% écart → parfait
  if (gapRatio <= 0.25) return 20;      // ≤25% → très bon
  if (gapRatio <= 0.50) return 12;      // ≤50% → moyen
  if (gapRatio <= 0.80) return 5;       // ≤80% → faible
  return 0;
};

/**
 * Calcule la compatibilité de localisation.
 * 20 pts si même ville, 5 pts si ville différente (peut déménager)
 */
const scoreCity = (cityA, cityB) => {
  if (!cityA || !cityB) return 0;
  return cityA.toLowerCase().trim() === cityB.toLowerCase().trim() ? 20 : 5;
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

  return Math.round(similarity * 25);
};

/**
 * Calcule la compatibilité de genre.
 * 15 pts si compatible, 0 si incompatible
 */
const scoreGender = (genderA, genderB, prefA, prefB) => {
  if (!genderA || !genderB) return 8; // neutre si non renseigné

  const aAcceptsB = !prefA || prefA === 'Peu importe' || prefA === genderB;
  const bAcceptsA = !prefB || prefB === 'Peu importe' || prefB === genderA;

  if (aAcceptsB && bAcceptsA) return 15;
  if (aAcceptsB || bAcceptsA) return 7;
  return 0;
};

/**
 * Bonus profil complet (10 pts) + activité récente (5 pts)
 */
const scoreBonuses = (userB) => {
  let bonus = 0;
  if (userB.profileComplete) bonus += 10;

  if (userB.lastSeen) {
    const hoursSince = (Date.now() - new Date(userB.lastSeen)) / (1000 * 3600);
    if (hoursSince < 24)  bonus += 5;  // actif aujourd'hui
    else if (hoursSince < 72) bonus += 3; // actif cette semaine
  }
  return bonus;
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
  const traits  = scoreTraits(userA.traits, userB.traits);
  const gender  = scoreGender(
    userA.gender, userB.gender,
    userA.preferences?.genderPref, userB.preferences?.genderPref
  );
  const bonuses = scoreBonuses(userB);

  const total = Math.min(100, budget + city + traits + gender + bonuses);

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
    breakdown: { budget, city, traits, gender, bonuses },
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
      const { score, label, breakdown } = calculateCompatibility(currentUser, userObj);
      return { ...userObj, matchScore: score, matchLabel: label, matchBreakdown: breakdown };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};

module.exports = { calculateCompatibility, sortByCompatibility };