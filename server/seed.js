// Run: node seed.js  (make sure MONGO_URI is set in .env)
require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/Property');

const properties = [
  {
    title: 'Modern Luxury Estate',
    price: 2850000,
    address: '1234 Beverly Hills Drive',
    city: 'Beverly Hills',
    type: 'House',
    status: 'Featured',
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 6720,
    pricePerSqft: 425,
    agent: 'John Mitchell',
    photos: 24,
  },
  {
    title: 'Downtown Penthouse',
    price: 1425000,
    address: '789 Metropolitan Ave',
    city: 'New York',
    type: 'Condo',
    status: 'New Listing',
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 2192,
    pricePerSqft: 650,
    agent: 'Emily Rodriguez',
    photos: 18,
  },
  {
    title: 'Family Suburban Home',
    price: 875000,
    oldPrice: 925000,
    address: '456 Maple Street',
    city: 'Austin',
    type: 'House',
    status: 'Price Drop',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3845,
    pricePerSqft: 228,
    agent: 'Michael Chen',
    photos: 32,
  },
  {
    title: 'Waterfront Villa',
    price: 4200000,
    address: '88 Oceanview Boulevard',
    city: 'Miami',
    type: 'House',
    status: 'Featured',
    bedrooms: 6,
    bathrooms: 5,
    sqft: 8200,
    pricePerSqft: 512,
    agent: 'Sofia Martinez',
    photos: 40,
  },
  {
    title: 'Urban Studio Apartment',
    price: 320000,
    address: '10 Central Park West',
    city: 'New York',
    type: 'Apartment',
    status: 'New Listing',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 620,
    pricePerSqft: 516,
    agent: 'James Lee',
    photos: 12,
  },
  {
    title: 'Hillside Townhouse',
    price: 680000,
    address: '55 Vineyard Lane',
    city: 'San Francisco',
    type: 'Townhouse',
    status: 'Featured',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1980,
    pricePerSqft: 343,
    agent: 'Anna Thompson',
    photos: 20,
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await Property.deleteMany({});
    await Property.insertMany(properties);
    console.log(`Seeded ${properties.length} properties.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
