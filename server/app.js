const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const contactRoutes  = require('./routes/contacts');
const propertyRoutes = require('./routes/properties');
const tourRoutes     = require('./routes/tours');
const authRoutes     = require('./routes/auth');

const app  = express();

// Enable Helmet for security headers
app.use(helmet());

// Prevent NoSQL query injection
app.use(mongoSanitize());

// Global API Rate Limiting (disabled in test environment to avoid blocking test runners)
const isTest = process.env.NODE_ENV === 'test';
if (!isTest) {
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
  });
  app.use('/api', apiLimiter);
}

// ── Middleware ─────────────────────────────────────────────
const corsOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  'https://omarkhaled2k3.github.io'
];

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || corsOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS Blocked Origin: ${origin}`);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true 
}));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────
app.use('/api/contacts',   contactRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/tours',      tourRoutes);
app.use('/api/auth',       authRoutes);

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }));

module.exports = app;
