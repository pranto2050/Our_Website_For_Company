// ============================================
// Service Controller
// ============================================

const pool = require('../config/database');

// Get all active services
exports.getAllServices = async (req, res) => {
  try {
    const [services] = await pool.query(
      'SELECT * FROM services WHERE is_active = true ORDER BY display_order'
    );
    res.json(services);
  } catch (err) {
    console.error('Get services error:', err);
    res.status(500).json({ error: 'Failed to get services' });
  }
};

// Get service by slug
exports.getServiceBySlug = async (req, res) => {
  try {
    const [services] = await pool.query(
      'SELECT * FROM services WHERE slug = ? AND is_active = true',
      [req.params.slug]
    );

    if (services.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(services[0]);
  } catch (err) {
    console.error('Get service error:', err);
    res.status(500).json({ error: 'Failed to get service' });
  }
};
