# ABIT Solutions - Backend API

## Project Structure

```
backend/
├── database/
│   ├── schema.sql          # Complete MySQL database schema
│   ├── seed.sql            # Initial seed data
│   └── migrations/         # Database migrations
├── src/
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   └── utils/              # Utility functions
├── .env.example            # Environment variables template
├── package.json            # Dependencies
└── server.js               # Main entry point
```

## Installation

```bash
cd backend
npm install
```

## Configuration

1. Copy `.env.example` to `.env`
2. Update database credentials
3. Set JWT secret key

```bash
cp .env.example .env
```

## Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

See `docs/API.md` for complete API documentation.

## Database Setup

```bash
# Create database and tables
mysql -u root -p < database/schema.sql

# Insert seed data
mysql -u root -p abit_solutions < database/seed.sql
```
