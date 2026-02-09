// ============================================
// Project Routes
// ============================================

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { authenticate, isApproved } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', projectController.getMyProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', isApproved, projectController.createProject);
router.put('/:id', projectController.updateProject);

module.exports = router;
