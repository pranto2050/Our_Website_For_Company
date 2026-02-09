// ============================================
// Authentication Controller
// ============================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const pool = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Register new user
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { 
    email, password, full_name, phone, company_name, 
    country, timezone, services_interested, project_description 
  } = req.body;

  try {
    // Check if user exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, hashedPassword]
    );

    const userId = result.insertId;

    // Create profile
    await pool.query(
      `INSERT INTO profiles (user_id, full_name, email, phone, company_name, country, timezone, services_interested, project_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, full_name, email, phone, company_name, country, timezone, JSON.stringify(services_interested || []), project_description]
    );

    // Assign client role
    await pool.query('INSERT INTO user_roles (user_id, role) VALUES (?, ?)', [userId, 'client']);

    res.status(201).json({ 
      message: 'Registration successful. Your account is pending approval.',
      userId 
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Get user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check profile status
    const [profiles] = await pool.query(
      'SELECT registration_status, full_name FROM profiles WHERE user_id = ?', 
      [user.id]
    );

    if (profiles.length === 0 || profiles[0].registration_status !== 'approved') {
      return res.status(403).json({ 
        error: 'Account not approved yet',
        status: profiles[0]?.registration_status || 'pending'
      });
    }

    // Get roles
    const [roles] = await pool.query('SELECT role FROM user_roles WHERE user_id = ?', [user.id]);

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: profiles[0].full_name,
        roles: roles.map(r => r.role)
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  // TODO: Implement password reset email
  res.json({ message: 'Password reset email sent (not implemented)' });
};

// Reset password
exports.resetPassword = async (req, res) => {
  // TODO: Implement password reset
  res.json({ message: 'Password reset (not implemented)' });
};
