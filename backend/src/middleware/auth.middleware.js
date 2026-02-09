// ============================================
// Authentication Middleware
// ============================================

const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Verify JWT Token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const [roles] = await pool.query(
      'SELECT role FROM user_roles WHERE user_id = ? AND role = ?',
      [req.user.id, 'admin']
    );

    if (roles.length === 0) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Check if user is approved
const isApproved = async (req, res, next) => {
  try {
    const [profiles] = await pool.query(
      'SELECT registration_status FROM profiles WHERE user_id = ?',
      [req.user.id]
    );

    if (profiles.length === 0 || profiles[0].registration_status !== 'approved') {
      return res.status(403).json({ error: 'Account not approved' });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { authenticate, isAdmin, isApproved };
