const express = require('express');
const router  = express.Router();
const Contact = require('../models/Contact');
const { verifyToken, isAdmin } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Strict form submission rate limiter: max 5 requests per 15 minutes per IP
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many contact form submissions. Please try again after 15 minutes.'
  }
});

// POST /api/contacts  — submit contact form
router.post('/', submissionLimiter, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, service, message, marketing } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    const contact = new Contact({ firstName, lastName, email, phone, service, message, marketing });
    await contact.save();
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// GET /api/contacts  — list all (admin use)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
