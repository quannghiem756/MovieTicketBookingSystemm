const express = require('express');
const SupportController = require('../controllers/SupportController');
const SupportService = require('../../../application/SupportService');
const MongoSupportTicketRepository = require('../../../infrastructure/repositories/MongoSupportTicketRepository');
const MongoTicketCommentRepository = require('../../../infrastructure/repositories/MongoTicketCommentRepository');
const emailService = require('../../../infrastructure/EmailService');
const { authenticate, authorizeStaff } = require('../middleware/auth');

const router = express.Router();

const supportTicketRepository = new MongoSupportTicketRepository();
const ticketCommentRepository = new MongoTicketCommentRepository();
const supportService = new SupportService(supportTicketRepository, ticketCommentRepository, emailService);
const supportController = new SupportController(supportService);

// Public route for creating tickets
router.post('/tickets', (req, res, next) => {
    // Optional authentication to auto-fill user data
    // We can try to authenticate but not fail if no token
    next();
}, (req, res) => supportController.createTicket(req, res));

// Public route for viewing ticket by token
router.get('/public/:token', (req, res) => supportController.getTicketByToken(req, res));

// Mobile app redirector route
router.get('/mobile-launch/:token', (req, res) => supportController.mobileLaunch(req, res));

// Public route for user reply by token
router.post('/public/:token/reply', (req, res) => supportController.addPublicReply(req, res));

// Admin route for viewing tickets (Admin and Staff)
router.get('/tickets', authenticate, authorizeStaff, (req, res) => supportController.getAllTickets(req, res));

// Admin/Staff route for viewing a specific ticket with comments
router.get('/tickets/:id', authenticate, authorizeStaff, (req, res) => supportController.getTicketById(req, res));

// Admin/Staff route for replying to a ticket
router.post('/tickets/:id/reply', authenticate, authorizeStaff, (req, res) => supportController.addInternalReply(req, res));

// Admin/Staff route for updating ticket status
router.patch('/tickets/:id/status', authenticate, authorizeStaff, (req, res) => supportController.updateTicketStatus(req, res));

module.exports = router;
