// ============================================
// Service Routes
// ============================================

const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/:slug', serviceController.getServiceBySlug);

module.exports = router;
