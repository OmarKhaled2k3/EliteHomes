const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    price:       { type: Number, required: true },
    oldPrice:    { type: Number },
    address:     { type: String, required: true },
    city:        { type: String, required: true },
    type:        { type: String, enum: ['House', 'Apartment', 'Condo', 'Townhouse'], required: true },
    status:      { type: String, enum: ['Featured', 'New Listing', 'Price Drop'], default: 'Featured' },
    bedrooms:    { type: Number, required: true },
    bathrooms:   { type: Number, required: true },
    sqft:        { type: Number, required: true },
    pricePerSqft:{ type: Number },
    agent:       { type: String },
    photos:      { type: Number, default: 0 },
    image:       { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
