require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');

const contactRoutes  = require('./routes/contacts');
const propertyRoutes = require('./routes/properties');
const tourRoutes     = require('./routes/tours');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────
const corsOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://omarkhaled2k3.github.io'
];

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || corsOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────
app.use('/api/contacts',   contactRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/tours',      tourRoutes);

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }));

// ── MongoDB Connection ──────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/elitehomes')
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () => console.log(`🚀  Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });
