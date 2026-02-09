// ============================================
// Portfolio Routes
// ============================================

const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolio.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', portfolioController.getAllProjects);
router.get('/categories', portfolioController.getCategories);
router.get('/:slug', portfolioController.getProjectBySlug);

// Admin routes
router.get('/admin/all', authenticate, isAdmin, portfolioController.adminGetAllProjects);
router.post('/', authenticate, isAdmin, portfolioController.createProject);
router.put('/:id', authenticate, isAdmin, portfolioController.updateProject);
router.delete('/:id', authenticate, isAdmin, portfolioController.deleteProject);

module.exports = router;
