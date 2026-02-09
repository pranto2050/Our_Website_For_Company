// ============================================
// Support Ticket Routes
// ============================================

const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { authenticate, isApproved } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', ticketController.getMyTickets);
router.get('/:id', ticketController.getTicketById);
router.post('/', isApproved, ticketController.createTicket);
router.post('/:id/messages', ticketController.addMessage);

module.exports = router;
