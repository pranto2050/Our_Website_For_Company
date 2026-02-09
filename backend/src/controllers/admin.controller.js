// ============================================
// Admin Controller
// ============================================

const pool = require('../config/database');

// ============================================
// Profile Management
// ============================================

exports.getAllProfiles = async (req, res) => {
  try {
    const [profiles] = await pool.query(
      'SELECT * FROM profiles ORDER BY created_at DESC'
    );
    profiles.forEach(p => {
      if (p.services_interested) p.services_interested = JSON.parse(p.services_interested);
    });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfileStatus = async (req, res) => {
  const { registration_status, admin_notes } = req.body;
  try {
    await pool.query(
      `UPDATE profiles SET registration_status = ?, admin_notes = ?, status_updated_at = NOW(), status_updated_by = ?, updated_at = NOW()
       WHERE id = ?`,
      [registration_status, admin_notes, req.user.id, req.params.id]
    );
    res.json({ message: 'Profile status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================
// Service Management
// ============================================

exports.getAllServices = async (req, res) => {
  try {
    const [services] = await pool.query('SELECT * FROM services ORDER BY display_order');
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createService = async (req, res) => {
  const { name, slug, description, icon, is_active, display_order } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO services (name, slug, description, icon, is_active, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [name, slug, description, icon, is_active ?? true, display_order ?? 0]
    );
    res.status(201).json({ id: result.insertId, message: 'Service created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateService = async (req, res) => {
  const { name, slug, description, icon, is_active, display_order } = req.body;
  try {
    await pool.query(
      'UPDATE services SET name = ?, slug = ?, description = ?, icon = ?, is_active = ?, display_order = ? WHERE id = ?',
      [name, slug, description, icon, is_active, display_order, req.params.id]
    );
    res.json({ message: 'Service updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    await pool.query('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================
// Project Management
// ============================================

exports.getAllProjects = async (req, res) => {
  try {
    const [projects] = await pool.query(`
      SELECT p.*, pr.full_name as client_name, pr.email as client_email
      FROM projects p
      LEFT JOIN profiles pr ON p.client_id = pr.user_id
      ORDER BY p.created_at DESC
    `);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  const { status, assigned_to, notes, priority } = req.body;
  try {
    await pool.query(
      `UPDATE projects SET status = ?, assigned_to = ?, notes = ?, priority = ?, updated_at = NOW(),
       completed_at = CASE WHEN ? = 'completed' THEN NOW() ELSE completed_at END
       WHERE id = ?`,
      [status, assigned_to, notes, priority, status, req.params.id]
    );
    res.json({ message: 'Project updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================
// Ticket Management
// ============================================

exports.getAllTickets = async (req, res) => {
  try {
    const [tickets] = await pool.query(`
      SELECT t.*, pr.full_name as client_name, pr.email as client_email
      FROM support_tickets t
      LEFT JOIN profiles pr ON t.client_id = pr.user_id
      ORDER BY t.created_at DESC
    `);
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTicket = async (req, res) => {
  const { status, assigned_to, priority } = req.body;
  try {
    await pool.query(
      `UPDATE support_tickets SET status = ?, assigned_to = ?, priority = ?, updated_at = NOW(),
       resolved_at = CASE WHEN ? = 'resolved' THEN NOW() ELSE resolved_at END,
       closed_at = CASE WHEN ? = 'closed' THEN NOW() ELSE closed_at END
       WHERE id = ?`,
      [status, assigned_to, priority, status, status, req.params.id]
    );
    res.json({ message: 'Ticket updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTicketMessages = async (req, res) => {
  try {
    const [messages] = await pool.query(`
      SELECT tm.*, p.full_name as sender_name
      FROM ticket_messages tm
      LEFT JOIN profiles p ON tm.sender_id = p.user_id
      WHERE tm.ticket_id = ?
      ORDER BY tm.created_at
    `, [req.params.id]);
    messages.forEach(m => {
      if (m.attachments) m.attachments = JSON.parse(m.attachments);
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================
// Role Management
// ============================================

exports.getUserRoles = async (req, res) => {
  try {
    const [roles] = await pool.query('SELECT * FROM user_roles WHERE user_id = ?', [req.params.userId]);
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignRole = async (req, res) => {
  const { user_id, role } = req.body;
  try {
    await pool.query('INSERT INTO user_roles (user_id, role) VALUES (?, ?)', [user_id, role]);
    res.status(201).json({ message: 'Role assigned' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeRole = async (req, res) => {
  try {
    await pool.query('DELETE FROM user_roles WHERE user_id = ? AND role = ?', [req.params.userId, req.params.role]);
    res.json({ message: 'Role removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================
// Notifications
// ============================================

exports.createNotification = async (req, res) => {
  const { user_id, title, message, type, link } = req.body;
  try {
    await pool.query(
      'INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, ?, ?)',
      [user_id, title, message, type || 'info', link]
    );
    res.status(201).json({ message: 'Notification created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================
// Dashboard Stats
// ============================================

exports.getDashboardStats = async (req, res) => {
  try {
    const [[users]] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [[pending]] = await pool.query("SELECT COUNT(*) as count FROM profiles WHERE registration_status = 'pending'");
    const [[projects]] = await pool.query('SELECT COUNT(*) as count FROM projects');
    const [[openTickets]] = await pool.query("SELECT COUNT(*) as count FROM support_tickets WHERE status = 'open'");

    res.json({
      totalUsers: users.count,
      pendingApprovals: pending.count,
      totalProjects: projects.count,
      openTickets: openTickets.count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
