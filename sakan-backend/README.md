# SakanCampus — Backend API

Stack: **Node.js · Express · MongoDB · JWT · Cloudinary**

---

## ⚡ Installation rapide

```bash
cd backend
npm install
cp .env.example .env
# → Remplis ton .env (MongoDB URI, JWT, Cloudinary)
npm run dev
```

---

## 🔑 Setup en 3 étapes

### 1. MongoDB Atlas (gratuit)
1. Va sur [cloud.mongodb.com](https://cloud.mongodb.com)
2. Crée un cluster gratuit (M0)
3. **Database Access** → Add user → username + password
4. **Network Access** → Add IP → `0.0.0.0/0` (allow all)
5. **Connect** → Drivers → copie l'URI dans `.env`

### 2. Cloudinary (gratuit 25GB)
1. Va sur [cloudinary.com](https://cloudinary.com) → Sign up
2. Dashboard → copie `Cloud Name`, `API Key`, `API Secret` dans `.env`

### 3. JWT Secret
```bash
# Génère un secret fort:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📡 API Endpoints

### Auth
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion → retourne JWT |
| GET  | `/api/auth/me` | Profil connecté *(auth)* |
| POST | `/api/auth/logout` | Déconnexion *(auth)* |

### Users
| Méthode | Route | Description |
|---------|-------|-------------|
| GET  | `/api/users/feed` | Feed trié par score IA *(auth)* |
| PUT  | `/api/users/profile` | Mettre à jour profil *(auth)* |
| GET  | `/api/users/:id` | Profil public + compatibilité *(auth)* |
| POST | `/api/users/favorites/:annonceId` | Toggle favori *(auth)* |
| PUT  | `/api/users/password` | Changer mot de passe *(auth)* |

### Annonces
| Méthode | Route | Description |
|---------|-------|-------------|
| GET    | `/api/annonces` | Toutes les annonces (filtres) *(auth)* |
| GET    | `/api/annonces/mine` | Mes annonces *(auth)* |
| GET    | `/api/annonces/:id` | Détail annonce *(auth)* |
| POST   | `/api/annonces` | Créer une annonce *(auth)* |
| PUT    | `/api/annonces/:id` | Modifier *(auth, owner)* |
| DELETE | `/api/annonces/:id` | Supprimer *(auth, owner)* |
| POST   | `/api/annonces/:id/favorite` | Toggle favori *(auth)* |

### Upload
| Méthode | Route | Description |
|---------|-------|-------------|
| POST   | `/api/upload/profile` | Upload photo profil *(auth)* |
| POST   | `/api/upload/annonce` | Upload photos annonce (max 6) *(auth)* |
| DELETE | `/api/upload/:publicId` | Supprimer une photo *(auth)* |

### Messages
| Méthode | Route | Description |
|---------|-------|-------------|
| GET  | `/api/messages/conversations` | Liste des conversations *(auth)* |
| GET  | `/api/messages/:userId` | Messages avec un user *(auth)* |
| POST | `/api/messages/:userId` | Envoyer un message *(auth)* |
| GET  | `/api/messages/unread/count` | Nb messages non lus *(auth)* |

---

## 🤖 Algorithme Matching IA

Critères pondérés **(total: 100 pts)**:

| Critère | Max | Logique |
|---------|-----|---------|
| Budget compatible | 25 pts | Jaccard sur fourchette de prix |
| Ville identique | 20 pts | Match exact ville |
| Traits communs | 25 pts | Similarité Jaccard des traits |
| Genre accepté | 15 pts | Préférences mutuelles |
| Profil complet | 10 pts | Bonus si profileComplete = true |
| Activité récente | 5 pts | Bonus si actif < 24h |

```
≥85 pts → Excellent match
≥70 pts → Très compatible
≥55 pts → Compatible
≥40 pts → Peu compatible
<40 pts → Incompatible
```

---

## 🔗 Connecter au Frontend

Dans ton fichier React, crée `src/api/client.js`:

```js
const API = 'http://localhost:5000/api';

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('sc_token');
  const res = await fetch(`${API}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  return res.json();
};

// Usage:
// const { user, token } = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
// const { users } = await api('/users/feed?city=Settat');
```

---

## 🚀 Déploiement

**Recommandé: Railway.app** (gratuit, deploy en 2 min)
1. `railway login`
2. `railway init` → `railway up`
3. Ajoute les variables d'env dans le dashboard Railway