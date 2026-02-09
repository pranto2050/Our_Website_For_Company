// ============================================
// Tier Routes
// ============================================

const express = require('express');
const router = express.Router();
const tierController = require('../controllers/tier.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', tierController.getAllTiers);
router.get('/:key', tierController.getTierByKey);

// Admin routes
router.get('/admin/all', authenticate, isAdmin, tierController.adminGetAllTiers);
router.post('/', authenticate, isAdmin, tierController.createTier);
router.put('/:id', authenticate, isAdmin, tierController.updateTier);
router.delete('/:id', authenticate, isAdmin, tierController.deleteTier);

module.exports = router;
