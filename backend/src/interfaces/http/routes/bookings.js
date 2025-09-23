const express = require('express');
const BookingController = require('../controllers/BookingController');
const MongoBookingRepository = require('../../../infrastructure/repositories/MongoBookingRepository');
const BookingService = require('../../../application/BookingService');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Initialize service and controller
const bookingRepository = new MongoBookingRepository();
const bookingService = new BookingService(bookingRepository);
const bookingController = new BookingController(bookingService);

const router = express.Router();

// Protected routes
router.get('/', authenticate, authorizeAdmin, (req, res) => bookingController.getAllBookings(req, res));
router.post('/', authenticate, (req, res) => bookingController.createBooking(req, res));
router.get('/:id', authenticate, (req, res) => bookingController.getBookingById(req, res));
router.get('/user/:userId', authenticate, (req, res) => bookingController.getBookingsByUserId(req, res));
router.put('/:id/confirm', authenticate, authorizeAdmin, (req, res) => bookingController.confirmBooking(req, res));
router.put('/:id/cancel', authenticate, (req, res) => bookingController.cancelBooking(req, res));

module.exports = router;