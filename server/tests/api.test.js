const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Contact = require('../models/Contact');
const TourRequest = require('../models/TourRequest');

const request = supertest(app);

// Use a separate test database
const TEST_MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/elitehomes_test';

beforeAll(async () => {
  // Set NODE_ENV to test to disable standard logs or rate limiters if needed
  process.env.NODE_ENV = 'test';
  
  // Connect to test DB
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }
});

afterAll(async () => {
  // Purge test database collections
  await User.deleteMany({});
  await Contact.deleteMany({});
  await TourRequest.deleteMany({});
  
  // Disconnect from database
  await mongoose.connection.close();
});

describe('EliteHomes Fullstack Integration Test Suite', () => {

  // 1. Health check route
  describe('GET /api/health', () => {
    it('should return 200 OK and health status', async () => {
      const res = await request.get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body).toHaveProperty('time');
    });
  });

  // 2. Unauthenticated GET /api/contacts
  describe('GET /api/contacts (Access Guard)', () => {
    it('should return 401 Unauthorized without Bearer token', async () => {
      const res = await request.get('/api/contacts');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('No token provided');
    });
  });

  // 3. Public POST /api/contacts
  describe('POST /api/contacts (Public Message Board)', () => {
    it('should successfully submit contact inquiry and save to MongoDB', async () => {
      const contactData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        service: 'Buying',
        message: 'Looking to purchase a featured townhouse.',
        marketing: true
      };

      const res = await request.post('/api/contacts').send(contactData);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Message sent successfully!');

      // Verify db insertion
      const contact = await Contact.findOne({ email: 'john.doe@example.com' });
      expect(contact).toBeTruthy();
      expect(contact.firstName).toBe('John');
      expect(contact.service).toBe('Buying');
    });

    it('should reject with 400 Bad Request on invalid email validation', async () => {
      const invalidData = {
        firstName: 'Invalid',
        lastName: 'User',
        email: 'bad-email-address',
        phone: '1234567890'
      };

      const res = await request.post('/api/contacts').send(invalidData);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email address.');
    });
  });

  // 4. Authenticated Admin flow
  describe('User Registration & Login (JWT Authentication)', () => {
    const adminUser = {
      name: 'Test Administrator',
      email: 'test.admin@elitehomes.com',
      password: 'testadminpassword',
      role: 'admin'
    };

    let authToken = '';

    it('should register a new administrator successfully', async () => {
      const res = await request.post('/api/auth/register').send(adminUser);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(adminUser.email);
      expect(res.body.data.role).toBe('admin');
    });

    it('should login admin and return a valid JWT token', async () => {
      const loginPayload = {
        email: adminUser.email,
        password: adminUser.password
      };

      const res = await request.post('/api/auth/login').send(loginPayload);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.role).toBe('admin');
      
      authToken = res.body.token;
    });

    it('should authorize secure GET /api/contacts using the returned token', async () => {
      expect(authToken).toBeTruthy();

      const res = await request
        .get('/api/contacts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      
      // Should find the John Doe contact we made earlier
      const foundContact = res.body.data.find(c => c.email === 'john.doe@example.com');
      expect(foundContact).toBeDefined();
      expect(foundContact.firstName).toBe('John');
    });
  });

  // 5. Tour request submission & retrieval
  describe('Tour requests Flow', () => {
    let adminToken = '';

    beforeAll(async () => {
      // Log in to get standard admin authorization token
      const res = await request.post('/api/auth/login').send({
        email: 'test.admin@elitehomes.com',
        password: 'testadminpassword'
      });
      adminToken = res.body.token;
    });

    it('should schedule a tour request successfully', async () => {
      const tourPayload = {
        propertyId: new mongoose.Types.ObjectId().toString(),
        propertyTitle: 'Sunset Hills Townhouse',
        name: 'Sarah Connor',
        email: 'sarah@skynet.com',
        phone: '9876543210',
        preferredDate: '2026-06-15T10:00:00.000Z',
        message: 'Prefer morning viewings.'
      };

      const res = await request.post('/api/tours').send(tourPayload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Tour scheduled successfully!');

      // Check DB
      const tour = await TourRequest.findOne({ email: 'sarah@skynet.com' });
      expect(tour).toBeTruthy();
      expect(tour.propertyTitle).toBe('Sunset Hills Townhouse');
    });

    it('should secure GET /api/tours and return scheduled tours to authorized admins', async () => {
      const res = await request
        .get('/api/tours')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      const foundTour = res.body.data.find(t => t.email === 'sarah@skynet.com');
      expect(foundTour).toBeDefined();
      expect(foundTour.name).toBe('Sarah Connor');
    });
  });
});
