// ============================================
// Payment Routes
// ============================================

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate, isAdmin, isApproved } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Client routes
router.get('/', paymentController.getMyPayments);
router.get('/:id', paymentController.getPaymentById);
router.post('/', isApproved, paymentController.createPayment);
router.post('/process', isApproved, paymentController.processPayment);

// Admin routes
router.get('/admin/all', isAdmin, paymentController.getAllPayments);
router.get('/admin/stats', isAdmin, paymentController.getPaymentStats);
router.put('/admin/:id/status', isAdmin, paymentController.updatePaymentStatus);

module.exports = router;
