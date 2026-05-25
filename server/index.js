require('dotenv').config();
const mongoose = require('mongoose');
const app      = require('./app');

const PORT = process.env.PORT || 5000;

// ── MongoDB Connection ──────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/elitehomes')
  .then(async () => {
    console.log('✅  MongoDB connected');
    
    // Seed default admin if User collection is empty or if admin@elitehomes.com doesn't exist
    const User = require('./models/User');
    try {
      const adminExists = await User.findOne({ email: 'admin@elitehomes.com' });
      if (!adminExists) {
        const defaultAdmin = new User({
          name: 'Elite Admin',
          email: 'admin@elitehomes.com',
          password: 'admin12345',
          role: 'admin'
        });
        await defaultAdmin.save();
        console.log('👤  Default admin seeded (admin@elitehomes.com / admin12345)');
      }
    } catch (seedErr) {
      console.error('❌  Error checking/seeding default admin:', seedErr.message);
    }

    app.listen(PORT, () => console.log(`🚀  Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });
