// ============================================
// Blog Routes
// ============================================

const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', blogController.getAllPosts);
router.get('/categories', blogController.getCategories);
router.get('/:slug', blogController.getPostBySlug);

// Admin routes
router.get('/admin/all', authenticate, isAdmin, blogController.adminGetAllPosts);
router.post('/', authenticate, isAdmin, blogController.createPost);
router.put('/:id', authenticate, isAdmin, blogController.updatePost);
router.delete('/:id', authenticate, isAdmin, blogController.deletePost);

module.exports = router;
