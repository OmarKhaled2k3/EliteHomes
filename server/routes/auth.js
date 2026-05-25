const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'elitehomes_secret_key_2026';

// POST /api/auth/register — Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email.' });
    }

    // Create and save user (password is automatically hashed in pre-save hook)
    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// POST /api/auth/login — Authenticate user and return JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        wishlist: user.wishlist || []
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// GET /api/auth/me — Get logged-in user profile details
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/auth/wishlist/:propertyId — Toggle wishlist item
router.post('/wishlist/:propertyId', verifyToken, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const index = user.wishlist.indexOf(propertyId);
    if (index === -1) {
      user.wishlist.push(propertyId);
    } else {
      user.wishlist.splice(index, 1);
    }
    await user.save();
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error toggling wishlist.' });
  }
});

// GET /api/auth/wishlist — Get populated wishlist properties
router.get('/wishlist', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: user.wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error retrieving wishlist.' });
  }
});

module.exports = router;
