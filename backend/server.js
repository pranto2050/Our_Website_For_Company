// ============================================
// ABIT Solutions - Main Server Entry Point
// Complete Node.js/Express API
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import Routes
const authRoutes = require('./src/routes/auth.routes');
const profileRoutes = require('./src/routes/profile.routes');
const serviceRoutes = require('./src/routes/service.routes');
const categoryRoutes = require('./src/routes/category.routes');
const tierRoutes = require('./src/routes/tier.routes');
const projectRoutes = require('./src/routes/project.routes');
const paymentRoutes = require('./src/routes/payment.routes');
const ticketRoutes = require('./src/routes/ticket.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const blogRoutes = require('./src/routes/blog.routes');
const portfolioRoutes = require('./src/routes/portfolio.routes');
const adminRoutes = require('./src/routes/admin.routes');

const app = express();

// ============================================
// Middleware
// ============================================

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 login attempts per hour
  message: { error: 'Too many login attempts, please try again later' }
});
app.use('/api/auth/login', authLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// API Routes
// ============================================

// Authentication
app.use('/api/auth', authRoutes);

// User Management
app.use('/api/profiles', profileRoutes);

// Services & Categories
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tiers', tierRoutes);

// Projects & Payments
app.use('/api/projects', projectRoutes);
app.use('/api/payments', paymentRoutes);

// Support System
app.use('/api/tickets', ticketRoutes);
app.use('/api/notifications', notificationRoutes);

// Content Management
app.use('/api/blog', blogRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Admin Panel
app.use('/api/admin', adminRoutes);

// ============================================
// Health & Status Endpoints
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    name: 'ABIT Solutions API',
    version: '2.0.0',
    description: 'Complete REST API for ABIT Solutions platform',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      profiles: '/api/profiles',
      services: '/api/services',
      categories: '/api/categories',
      tiers: '/api/tiers',
      projects: '/api/projects',
      payments: '/api/payments',
      tickets: '/api/tickets',
      notifications: '/api/notifications',
      blog: '/api/blog',
      portfolio: '/api/portfolio',
      admin: '/api/admin'
    }
  });
});

// ============================================
// Error Handling
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: err.errors 
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }
  
  // Database errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Duplicate entry' });
  }
  
  // Default error
  res.status(err.status || 500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// ============================================
// Start Server
// ============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║                                                        ║
  ║     █████╗ ██████╗ ██╗████████╗                       ║
  ║    ██╔══██╗██╔══██╗██║╚══██╔══╝                       ║
  ║    ███████║██████╔╝██║   ██║                          ║
  ║    ██╔══██║██╔══██╗██║   ██║                          ║
  ║    ██║  ██║██████╔╝██║   ██║                          ║
  ║    ╚═╝  ╚═╝╚═════╝ ╚═╝   ╚═╝                          ║
  ║                                                        ║
  ║   ABIT Solutions - API Server v2.0                    ║
  ║   ─────────────────────────────────────               ║
  ║   Port: ${PORT}                                           ║
  ║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(15)}                  ║
  ║   API Docs: http://localhost:${PORT}/api                   ║
  ║                                                        ║
  ╚════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
