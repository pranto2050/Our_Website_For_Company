// ============================================
// Profile Controller
// ============================================

const pool = require('../config/database');

// Get current user's profile
exports.getMyProfile = async (req, res) => {
  try {
    const [profiles] = await pool.query(
      'SELECT * FROM profiles WHERE user_id = ?',
      [req.user.id]
    );

    if (profiles.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Parse JSON fields
    const profile = profiles[0];
    if (profile.services_interested) {
      profile.services_interested = JSON.parse(profile.services_interested);
    }

    res.json(profile);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

// Update current user's profile
exports.updateMyProfile = async (req, res) => {
  const { full_name, phone, company_name, country, timezone, avatar_url } = req.body;

  try {
    await pool.query(
      `UPDATE profiles 
       SET full_name = ?, phone = ?, company_name = ?, country = ?, timezone = ?, avatar_url = ?, updated_at = NOW()
       WHERE user_id = ?`,
      [full_name, phone, company_name, country, timezone, avatar_url, req.user.id]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
