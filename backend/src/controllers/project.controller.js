// ============================================
// Project Controller
// ============================================

const pool = require('../config/database');

// Get user's projects
exports.getMyProjects = async (req, res) => {
  try {
    const [projects] = await pool.query(
      'SELECT * FROM projects WHERE client_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(projects);
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ error: 'Failed to get projects' });
  }
};

// Get single project
exports.getProjectById = async (req, res) => {
  try {
    const [projects] = await pool.query(
      'SELECT * FROM projects WHERE id = ? AND client_id = ?',
      [req.params.id, req.user.id]
    );

    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(projects[0]);
  } catch (err) {
    console.error('Get project error:', err);
    res.status(500).json({ error: 'Failed to get project' });
  }
};

// Create project
exports.createProject = async (req, res) => {
  const { title, description, service_type, budget, start_date, due_date, priority } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO projects (client_id, title, description, service_type, budget, start_date, due_date, priority)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, title, description, service_type, budget, start_date, due_date, priority || 'medium']
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'Project created successfully' 
    });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  const { title, description, notes } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE projects 
       SET title = ?, description = ?, notes = ?, updated_at = NOW()
       WHERE id = ? AND client_id = ?`,
      [title, description, notes, req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project updated successfully' });
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
};
