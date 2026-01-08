const express = require('express');
const SupportController = require('../controllers/SupportController');
const SupportService = require('../../../application/SupportService');
const MongoSupportTicketRepository = require('../../../infrastructure/repositories/MongoSupportTicketRepository');
const MongoTicketCommentRepository = require('../../../infrastructure/repositories/MongoTicketCommentRepository');
const { authenticate, authorizeStaff } = require('../middleware/auth');

const router = express.Router();

const supportTicketRepository = new MongoSupportTicketRepository();
const ticketCommentRepository = new MongoTicketCommentRepository();
const supportService = new SupportService(supportTicketRepository, ticketCommentRepository);
const supportController = new SupportController(supportService);

// Public route for creating tickets
router.post('/tickets', (req, res, next) => {
    // Optional authentication to auto-fill user data
    // We can try to authenticate but not fail if no token
    next();
}, (req, res) => supportController.createTicket(req, res));

// Public route for viewing ticket by token
router.get('/public/:token', (req, res) => supportController.getTicketByToken(req, res));

// Admin route for viewing tickets (Admin and Staff)
router.get('/tickets', authenticate, authorizeStaff, (req, res) => supportController.getAllTickets(req, res));

module.exports = router;
