// ============================================
// Portfolio Controller
// ============================================

const pool = require('../config/database');

// Get all active portfolio projects
exports.getAllProjects = async (req, res) => {
  try {
    const { category, featured, limit = 20, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM portfolio_projects WHERE is_active = true';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (featured === 'true') {
      query += ' AND is_featured = true';
    }

    query += ' ORDER BY display_order, created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [projects] = await pool.query(query, params);
    
    // Parse technologies JSON
    const parsedProjects = projects.map(project => ({
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : []
    }));

    res.json(parsedProjects);
  } catch (err) {
    console.error('Get portfolio projects error:', err);
    res.status(500).json({ error: 'Failed to get portfolio projects' });
  }
};

// Get single portfolio project by slug
exports.getProjectBySlug = async (req, res) => {
  try {
    const [projects] = await pool.query(
      'SELECT * FROM portfolio_projects WHERE slug = ? AND is_active = true',
      [req.params.slug]
    );

    if (projects.length === 0) {
      return res.status(404).json({ error: 'Portfolio project not found' });
    }

    const project = projects[0];
    project.technologies = project.technologies ? JSON.parse(project.technologies) : [];

    res.json(project);
  } catch (err) {
    console.error('Get portfolio project error:', err);
    res.status(500).json({ error: 'Failed to get portfolio project' });
  }
};

// Get portfolio categories
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      `SELECT category, COUNT(*) as count
       FROM portfolio_projects
       WHERE is_active = true AND category IS NOT NULL
       GROUP BY category
       ORDER BY count DESC`
    );
    res.json(categories);
  } catch (err) {
    console.error('Get portfolio categories error:', err);
    res.status(500).json({ error: 'Failed to get categories' });
  }
};

// Admin: Get all portfolio projects (including inactive)
exports.adminGetAllProjects = async (req, res) => {
  try {
    const [projects] = await pool.query(
      'SELECT * FROM portfolio_projects ORDER BY display_order, created_at DESC'
    );
    
    const parsedProjects = projects.map(project => ({
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : []
    }));

    res.json(parsedProjects);
  } catch (err) {
    console.error('Admin get portfolio projects error:', err);
    res.status(500).json({ error: 'Failed to get portfolio projects' });
  }
};

// Admin: Create portfolio project
exports.createProject = async (req, res) => {
  const { 
    title, slug, description, short_description, image_url, demo_url,
    category, technologies, base_price, is_featured, display_order 
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO portfolio_projects 
       (title, slug, description, short_description, image_url, demo_url, category, technologies, base_price, is_featured, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        description,
        short_description,
        image_url,
        demo_url,
        category,
        JSON.stringify(technologies || []),
        base_price,
        is_featured || false,
        display_order || 0
      ]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'Portfolio project created successfully' 
    });
  } catch (err) {
    console.error('Create portfolio project error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create portfolio project' });
  }
};

// Admin: Update portfolio project
exports.updateProject = async (req, res) => {
  const { 
    title, slug, description, short_description, image_url, demo_url,
    category, technologies, base_price, is_featured, is_active, display_order 
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE portfolio_projects 
       SET title = ?, slug = ?, description = ?, short_description = ?, 
           image_url = ?, demo_url = ?, category = ?, technologies = ?,
           base_price = ?, is_featured = ?, is_active = ?, display_order = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        title, slug, description, short_description, image_url, demo_url,
        category, JSON.stringify(technologies || []), base_price,
        is_featured, is_active, display_order, req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Portfolio project not found' });
    }

    res.json({ message: 'Portfolio project updated successfully' });
  } catch (err) {
    console.error('Update portfolio project error:', err);
    res.status(500).json({ error: 'Failed to update portfolio project' });
  }
};

// Admin: Delete portfolio project
exports.deleteProject = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM portfolio_projects WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Portfolio project not found' });
    }

    res.json({ message: 'Portfolio project deleted successfully' });
  } catch (err) {
    console.error('Delete portfolio project error:', err);
    res.status(500).json({ error: 'Failed to delete portfolio project' });
  }
};
