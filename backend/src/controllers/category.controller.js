// ============================================
// Category Controller
// ============================================

const pool = require('../config/database');

// Get all active categories
exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      'SELECT * FROM project_categories WHERE is_active = true ORDER BY display_order'
    );
    res.json(categories);
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: 'Failed to get categories' });
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const [categories] = await pool.query(
      'SELECT * FROM project_categories WHERE slug = ? AND is_active = true',
      [req.params.slug]
    );

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(categories[0]);
  } catch (err) {
    console.error('Get category error:', err);
    res.status(500).json({ error: 'Failed to get category' });
  }
};

// Admin: Get all categories (including inactive)
exports.adminGetAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      'SELECT * FROM project_categories ORDER BY display_order'
    );
    res.json(categories);
  } catch (err) {
    console.error('Admin get categories error:', err);
    res.status(500).json({ error: 'Failed to get categories' });
  }
};

// Admin: Create category
exports.createCategory = async (req, res) => {
  const { name, slug, description, icon, base_delivery_days, deposit_percentage, display_order } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO project_categories 
       (name, slug, description, icon, base_delivery_days, deposit_percentage, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description, icon, base_delivery_days || 30, deposit_percentage || 30, display_order || 0]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'Category created successfully' 
    });
  } catch (err) {
    console.error('Create category error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Category slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Admin: Update category
exports.updateCategory = async (req, res) => {
  const { name, slug, description, icon, base_delivery_days, deposit_percentage, is_active, display_order } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE project_categories 
       SET name = ?, slug = ?, description = ?, icon = ?, 
           base_delivery_days = ?, deposit_percentage = ?, is_active = ?, display_order = ?
       WHERE id = ?`,
      [name, slug, description, icon, base_delivery_days, deposit_percentage, is_active, display_order, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Admin: Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM project_categories WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
