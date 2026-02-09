# ABIT Solutions - Setup Guide

## Prerequisites

- Node.js v18+ 
- MySQL 8.0+
- npm or yarn

## Step 1: Database Setup

### Option A: Using MySQL Command Line

```bash
# Login to MySQL
mysql -u root -p

# Run schema file
source /path/to/backend/database/schema.sql

# Run seed data
source /path/to/backend/database/seed.sql
```

### Option B: Using phpMyAdmin / MySQL Workbench

1. Open your MySQL client
2. Create database: `abit_solutions`
3. Import `database/schema.sql`
4. Import `database/seed.sql`

## Step 2: Environment Configuration

```bash
# Navigate to backend folder
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env
```

Update these values:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=abit_solutions
JWT_SECRET=generate-a-secure-random-string
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## Step 5: Test API

```bash
# Health check
curl http://localhost:3000/api/health

# Get services
curl http://localhost:3000/api/services
```

## Default Accounts

After running seed.sql:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@abit.solutions | Admin@123 |
| Client | demo@example.com | Client@123 |

**Note:** Change these passwords immediately in production!

## Folder Structure

```
backend/
├── database/
│   ├── schema.sql      # Database structure
│   └── seed.sql        # Initial data
├── docs/
│   ├── API.md          # API documentation
│   └── SETUP.md        # This file
├── src/
│   ├── config/         # Database config
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth middleware
│   └── routes/         # API routes
├── .env.example        # Environment template
├── package.json        # Dependencies
├── server.js           # Entry point
└── README.md           # Overview
```

## Common Issues

### MySQL Connection Error
- Check MySQL is running: `sudo systemctl status mysql`
- Verify credentials in `.env`
- Ensure database exists: `SHOW DATABASES;`

### Port Already in Use
- Change PORT in `.env` or kill existing process:
  ```bash
  lsof -i :3000
  kill -9 <PID>
  ```

### JWT Errors
- Ensure JWT_SECRET is set in `.env`
- Token expires after 24h by default

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager: `pm2 start server.js`
3. Set up reverse proxy (nginx)
4. Enable HTTPS
5. Change default passwords
6. Set strong JWT_SECRET
