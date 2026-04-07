require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const connectDB  = require('./config/db');

const app = express();

const buildAllowedOrigins = () => {
  const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174'];
  const envOrigins = [process.env.FRONTEND_URL, process.env.CORS_ORIGIN]
    .filter(Boolean)
    .flatMap((value) => String(value).split(',').map((item) => item.trim()))
    .filter(Boolean);

  return [...new Set([...defaultOrigins, ...envOrigins])];
};

const allowedOrigins = buildAllowedOrigins();

// ─── Connect Database ────────────────────────────────
connectDB();

// ─── Security Middleware ─────────────────────────────
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  credentials: true,
}));

// ─── Rate Limiting ───────────────────────────────────
const isDev = process.env.NODE_ENV === 'development';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 100,
  skip: (req) => req.path.startsWith('/api/messages'),
  message: { success: false, message: 'Trop de requêtes, réessaie dans 15 minutes.' }
});

const messagesLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isDev ? 600 : 120,
  message: { success: false, message: 'Trop de messages envoyés, ralentis un peu.' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 100 : 10,
  message: { success: false, message: 'Trop de tentatives de connexion.' }
});
const accountSecurityLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 60 : 8,
  message: { success: false, message: 'Trop de tentatives sur les paramètres sensibles.' }
});

app.use('/api/messages', messagesLimiter);
app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/users/password', accountSecurityLimiter);
app.use('/api/users/email-change', accountSecurityLimiter);

// ─── Body Parser ─────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Logger (dev only) ───────────────────────────────
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ─── Routes ──────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/annonces',  require('./routes/annonces'));
app.use('/api/messages',  require('./routes/messages'));
app.use('/api/upload',    require('./routes/upload'));
app.use('/api/ai',        require('./routes/ai'));
app.use('/api/contact',   require('./routes/contact'));

// ─── Health check ────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SakanCampus API is running 🚀', timestamp: new Date() });
});

// ─── 404 Handler ─────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route introuvable.' });
});

// ─── Global Error Handler ────────────────────────────
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erreur serveur interne.',
  });
});

// ─── Start Server ─────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SakanCampus API démarré sur le port ${PORT}`);
  console.log(`   Mode: ${process.env.NODE_ENV}`);
  console.log(`   URL:  http://localhost:${PORT}/api/health\n`);
  console.log(`   CORS origins: ${allowedOrigins.join(', ')}`);
});