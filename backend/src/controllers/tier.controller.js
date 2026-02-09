// ============================================
// Tier Controller
// ============================================

const pool = require('../config/database');

// Get all active tiers
exports.getAllTiers = async (req, res) => {
  try {
    const [tiers] = await pool.query(
      'SELECT * FROM project_tiers WHERE is_active = true ORDER BY display_order'
    );
    
    // Parse features JSON
    const parsedTiers = tiers.map(tier => ({
      ...tier,
      features: tier.features ? JSON.parse(tier.features) : []
    }));
    
    res.json(parsedTiers);
  } catch (err) {
    console.error('Get tiers error:', err);
    res.status(500).json({ error: 'Failed to get tiers' });
  }
};

// Get tier by key
exports.getTierByKey = async (req, res) => {
  try {
    const [tiers] = await pool.query(
      'SELECT * FROM project_tiers WHERE tier_key = ? AND is_active = true',
      [req.params.key]
    );

    if (tiers.length === 0) {
      return res.status(404).json({ error: 'Tier not found' });
    }

    const tier = tiers[0];
    tier.features = tier.features ? JSON.parse(tier.features) : [];

    res.json(tier);
  } catch (err) {
    console.error('Get tier error:', err);
    res.status(500).json({ error: 'Failed to get tier' });
  }
};

// Admin: Get all tiers (including inactive)
exports.adminGetAllTiers = async (req, res) => {
  try {
    const [tiers] = await pool.query(
      'SELECT * FROM project_tiers ORDER BY display_order'
    );
    
    const parsedTiers = tiers.map(tier => ({
      ...tier,
      features: tier.features ? JSON.parse(tier.features) : []
    }));
    
    res.json(parsedTiers);
  } catch (err) {
    console.error('Admin get tiers error:', err);
    res.status(500).json({ error: 'Failed to get tiers' });
  }
};

// Admin: Create tier
exports.createTier = async (req, res) => {
  const { 
    tier_key, name, description, icon, color_from, color_to, 
    features, price_multiplier, delivery_multiplier, display_order 
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO project_tiers 
       (tier_key, name, description, icon, color_from, color_to, features, price_multiplier, delivery_multiplier, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tier_key, 
        name, 
        description, 
        icon || 'Star', 
        color_from || 'slate-500', 
        color_to || 'slate-600',
        JSON.stringify(features || []),
        price_multiplier || 1.00,
        delivery_multiplier || 1.00,
        display_order || 0
      ]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'Tier created successfully' 
    });
  } catch (err) {
    console.error('Create tier error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Tier key already exists' });
    }
    res.status(500).json({ error: 'Failed to create tier' });
  }
};

// Admin: Update tier
exports.updateTier = async (req, res) => {
  const { 
    tier_key, name, description, icon, color_from, color_to, 
    features, price_multiplier, delivery_multiplier, is_active, display_order 
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE project_tiers 
       SET tier_key = ?, name = ?, description = ?, icon = ?, 
           color_from = ?, color_to = ?, features = ?, 
           price_multiplier = ?, delivery_multiplier = ?, 
           is_active = ?, display_order = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        tier_key, name, description, icon, color_from, color_to,
        JSON.stringify(features || []),
        price_multiplier, delivery_multiplier, is_active, display_order,
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tier not found' });
    }

    res.json({ message: 'Tier updated successfully' });
  } catch (err) {
    console.error('Update tier error:', err);
    res.status(500).json({ error: 'Failed to update tier' });
  }
};

// Admin: Delete tier
exports.deleteTier = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM project_tiers WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tier not found' });
    }

    res.json({ message: 'Tier deleted successfully' });
  } catch (err) {
    console.error('Delete tier error:', err);
    res.status(500).json({ error: 'Failed to delete tier' });
  }
};
