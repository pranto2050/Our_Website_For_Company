// ============================================
// Blog Controller
// ============================================

const pool = require('../config/database');

// Get all published blog posts
exports.getAllPosts = async (req, res) => {
  try {
    const { category, limit = 10, offset = 0 } = req.query;
    
    let query = `
      SELECT bp.*, p.full_name as author_name, p.avatar_url as author_avatar
      FROM blog_posts bp
      LEFT JOIN profiles p ON bp.author_id = p.user_id
      WHERE bp.status = 'published'
    `;
    const params = [];

    if (category) {
      query += ' AND bp.category = ?';
      params.push(category);
    }

    query += ' ORDER BY bp.published_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [posts] = await pool.query(query, params);
    
    // Parse tags JSON
    const parsedPosts = posts.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : []
    }));

    res.json(parsedPosts);
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ error: 'Failed to get blog posts' });
  }
};

// Get single blog post by slug
exports.getPostBySlug = async (req, res) => {
  try {
    const [posts] = await pool.query(
      `SELECT bp.*, p.full_name as author_name, p.avatar_url as author_avatar
       FROM blog_posts bp
       LEFT JOIN profiles p ON bp.author_id = p.user_id
       WHERE bp.slug = ? AND bp.status = 'published'`,
      [req.params.slug]
    );

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Increment views
    await pool.query(
      'UPDATE blog_posts SET views = views + 1 WHERE id = ?',
      [posts[0].id]
    );

    const post = posts[0];
    post.tags = post.tags ? JSON.parse(post.tags) : [];

    res.json(post);
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ error: 'Failed to get blog post' });
  }
};

// Get blog categories
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      `SELECT category, COUNT(*) as count
       FROM blog_posts
       WHERE status = 'published' AND category IS NOT NULL
       GROUP BY category
       ORDER BY count DESC`
    );
    res.json(categories);
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: 'Failed to get categories' });
  }
};

// Admin: Get all posts (including drafts)
exports.adminGetAllPosts = async (req, res) => {
  try {
    const [posts] = await pool.query(
      `SELECT bp.*, p.full_name as author_name
       FROM blog_posts bp
       LEFT JOIN profiles p ON bp.author_id = p.user_id
       ORDER BY bp.created_at DESC`
    );
    
    const parsedPosts = posts.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : []
    }));

    res.json(parsedPosts);
  } catch (err) {
    console.error('Admin get posts error:', err);
    res.status(500).json({ error: 'Failed to get blog posts' });
  }
};

// Admin: Create blog post
exports.createPost = async (req, res) => {
  const { title, slug, excerpt, content, featured_image, category, tags, status } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO blog_posts 
       (author_id, title, slug, excerpt, content, featured_image, category, tags, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        title,
        slug,
        excerpt,
        content,
        featured_image,
        category,
        JSON.stringify(tags || []),
        status || 'draft',
        status === 'published' ? new Date() : null
      ]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'Blog post created successfully' 
    });
  } catch (err) {
    console.error('Create post error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create blog post' });
  }
};

// Admin: Update blog post
exports.updatePost = async (req, res) => {
  const { title, slug, excerpt, content, featured_image, category, tags, status } = req.body;

  try {
    // Check if status changed to published
    const [existing] = await pool.query('SELECT status FROM blog_posts WHERE id = ?', [req.params.id]);
    
    let publishedAt = null;
    if (existing.length > 0 && existing[0].status !== 'published' && status === 'published') {
      publishedAt = new Date();
    }

    const query = publishedAt 
      ? `UPDATE blog_posts 
         SET title = ?, slug = ?, excerpt = ?, content = ?, featured_image = ?, 
             category = ?, tags = ?, status = ?, published_at = ?, updated_at = NOW()
         WHERE id = ?`
      : `UPDATE blog_posts 
         SET title = ?, slug = ?, excerpt = ?, content = ?, featured_image = ?, 
             category = ?, tags = ?, status = ?, updated_at = NOW()
         WHERE id = ?`;

    const params = publishedAt
      ? [title, slug, excerpt, content, featured_image, category, JSON.stringify(tags || []), status, publishedAt, req.params.id]
      : [title, slug, excerpt, content, featured_image, category, JSON.stringify(tags || []), status, req.params.id];

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ message: 'Blog post updated successfully' });
  } catch (err) {
    console.error('Update post error:', err);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
};

// Admin: Delete blog post
exports.deletePost = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM blog_posts WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
};
