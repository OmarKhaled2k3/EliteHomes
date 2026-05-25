const express     = require('express');
const router      = express.Router();
const TourRequest = require('../models/TourRequest');
const { verifyToken, isAdmin } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Strict form submission rate limiter: max 5 requests per 15 minutes per IP
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many tour request submissions. Please try again after 15 minutes.'
  }
});

// POST /api/tours
router.post('/', submissionLimiter, async (req, res) => {
  try {
    const { propertyId, propertyTitle, name, email, phone, preferredDate, message } = req.body;

    if (!propertyId || !name || !email || !phone || !preferredDate) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    const tour = new TourRequest({ propertyId, propertyTitle, name, email, phone, preferredDate, message });
    await tour.save();
    res.status(201).json({ success: true, message: 'Tour scheduled successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/tours
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const tours = await TourRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, data: tours });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
