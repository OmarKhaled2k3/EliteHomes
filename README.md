# EliteHomes – Real Estate Web Application

A fully-functional, responsive real estate web application built with **React.js**, **Node.js/Express**, and **MongoDB**.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React.js 18, React Router v6, Bootstrap 5, FontAwesome |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB + Mongoose ODM              |
| Dev tools | nodemon, concurrently               |

---

## Project Structure

```
elitehomes/
├── client/                   # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js         # Consistent navigation (all pages)
│   │   │   ├── Footer.js         # Consistent footer
│   │   │   ├── PropertyCard.js   # Reusable property card
│   │   │   ├── TourModal.js      # Schedule Tour form (Form #1)
│   │   │   └── Toast.js          # Global notifications
│   │   ├── context/
│   │   │   └── ToastContext.js   # Global toast state
│   │   ├── pages/
│   │   │   ├── Home.js           # Page 1 – Hero, Properties, Services, Testimonials, FAQ
│   │   │   ├── Properties.js     # Page 2 – Filterable property listings
│   │   │   └── Contact.js        # Page 3 – Contact form (Form #2)
│   │   ├── App.js                # Route definitions
│   │   ├── index.js              # React entry point
│   │   └── index.css             # Global styles (ported from original project)
│   └── package.json
│
└── server/                   # Node.js backend
    ├── models/
    │   ├── Property.js           # Property MongoDB schema
    │   ├── Contact.js            # Contact form MongoDB schema
    │   └── TourRequest.js        # Tour booking MongoDB schema
    ├── routes/
    │   ├── properties.js         # GET /api/properties, POST /api/properties
    │   ├── contacts.js           # POST /api/contacts, GET /api/contacts
    │   └── tours.js              # POST /api/tours, GET /api/tours
    ├── index.js                  # Express server entry
    ├── seed.js                   # Database seeding script
    ├── .env.example              # Environment variable template
    └── package.json
```

---

## Pages (3 Pages – Solo Student Requirement ✓)

### Page 1 – Home (`/`)
- Hero section with a property search form
- Stats (15,000+ listings, 98% satisfaction, etc.)
- Featured properties pulled from MongoDB
- Services tabs (Buying, Selling, Renting, Investing)
- Testimonials carousel
- FAQ accordion

### Page 2 – Properties (`/properties`)
- Full property listings from MongoDB
- Sidebar with live filters: city, type, price range, beds, baths, sqft
- Empty-state UI when no results match
- Schedule Tour modal on every card → saves to MongoDB

### Page 3 – Contact (`/contact`)
- Contact info cards (phone, email, office)
- Business hours
- Social media links
- Full contact form → saves to MongoDB

---

## Forms (2 Forms – Requirement ✓)

### Form 1 – Schedule Tour (TourModal)
Fields: Full Name, Email, Phone, Preferred Date, Notes  
Validation: required fields, email regex, phone regex, future-date check  
Saves to: `TourRequest` collection in MongoDB

### Form 2 – Contact Form (Contact page)
Fields: First Name, Last Name, Email, Phone, Service, Message, Marketing opt-in  
Validation: required fields, email regex, phone regex, message min-length  
Saves to: `Contact` collection in MongoDB

---

## Setup Instructions

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally **or** a MongoDB Atlas connection string

### 1. Clone / extract the project
```bash
cd elitehomes
```

### 2. Install all dependencies
```bash
# Root
npm install

# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 3. Configure environment
```bash
cd server
cp .env.example .env
# Edit .env and set your MONGO_URI
```

### 4. Seed the database (optional but recommended)
```bash
cd server
node seed.js
# Inserts 6 sample properties
```

### 5. Run development servers (from root)
```bash
# Start both frontend and backend concurrently
npm run dev

# Or separately:
npm run server   # http://localhost:5000
npm run client   # http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| GET    | /api/properties       | List all (supports filters)  |
| GET    | /api/properties/:id   | Get single property          |
| POST   | /api/properties       | Add property (seeding/admin) |
| POST   | /api/contacts         | Submit contact form          |
| GET    | /api/contacts         | List all contacts            |
| POST   | /api/tours            | Schedule a tour              |
| GET    | /api/tours            | List all tour requests       |
| GET    | /api/health           | Health check                 |

### Filter query params for GET /api/properties
`city`, `type`, `minPrice`, `maxPrice`, `bedrooms`, `bathrooms`, `minSqft`, `maxSqft`

---

## Project Requirements Checklist

| Requirement                                       | Status |
|---------------------------------------------------|--------|
| React.js frontend with HTML, CSS, Bootstrap       | ✅     |
| Node.js backend                                   | ✅     |
| MongoDB database integration (Mongoose)           | ✅     |
| Minimum 3 pages (1 student)                       | ✅ (3) |
| Minimum 2 forms                                   | ✅ (2) |
| Fully responsive (desktop, tablet, mobile)        | ✅     |
| Consistent navigation across all pages            | ✅     |
| Basic input validation on all forms               | ✅     |
