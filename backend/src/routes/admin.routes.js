// ============================================
// Admin Routes
// ============================================

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// All routes require authentication and admin role
router.use(authenticate, isAdmin);

// Profile Management
router.get('/profiles', adminController.getAllProfiles);
router.put('/profiles/:id/status', adminController.updateProfileStatus);

// Service Management
router.get('/services', adminController.getAllServices);
router.post('/services', adminController.createService);
router.put('/services/:id', adminController.updateService);
router.delete('/services/:id', adminController.deleteService);

// Project Management
router.get('/projects', adminController.getAllProjects);
router.put('/projects/:id', adminController.updateProject);

// Ticket Management
router.get('/tickets', adminController.getAllTickets);
router.put('/tickets/:id', adminController.updateTicket);
router.get('/tickets/:id/messages', adminController.getTicketMessages);

// Role Management
router.get('/roles/:userId', adminController.getUserRoles);
router.post('/roles', adminController.assignRole);
router.delete('/roles/:userId/:role', adminController.removeRole);

// Notifications
router.post('/notifications', adminController.createNotification);

// Dashboard Stats
router.get('/stats', adminController.getDashboardStats);

module.exports = router;
