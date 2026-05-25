const express  = require('express');
const router   = express.Router();
const Property = require('../models/Property');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET /api/properties  — with optional filters
router.get('/', async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, bedrooms, bathrooms, minSqft, maxSqft } = req.query;
    const filter = {};
    if (city)      filter.city      = { $regex: city, $options: 'i' };
    if (type)      filter.type      = type;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (bedrooms)  filter.bedrooms  = { $gte: Number(bedrooms) };
    if (bathrooms) filter.bathrooms = { $gte: Number(bathrooms) };
    if (minSqft || maxSqft) {
      filter.sqft = {};
      if (minSqft) filter.sqft.$gte = Number(minSqft);
      if (maxSqft) filter.sqft.$lte = Number(maxSqft);
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: properties });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/properties/:id
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });
    res.json({ success: true, data: property });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/properties  — add a property (admin / seed)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json({ success: true, data: property });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
