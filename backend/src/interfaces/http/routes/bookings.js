const express = require('express');
const BookingController = require('../controllers/BookingController');
const MongoBookingRepository = require('../../../infrastructure/repositories/MongoBookingRepository');
const BookingService = require('../../../application/BookingService');

// Initialize service and controller
const bookingRepository = new MongoBookingRepository();
const bookingService = new BookingService(bookingRepository);
const bookingController = new BookingController(bookingService);

const router = express.Router();

// Booking routes
router.post('/', (req, res) => bookingController.createBooking(req, res));
router.get('/:id', (req, res) => bookingController.getBookingById(req, res));
router.get('/user/:userId', (req, res) => bookingController.getBookingsByUserId(req, res));
router.put('/:id/confirm', (req, res) => bookingController.confirmBooking(req, res));
router.put('/:id/cancel', (req, res) => bookingController.cancelBooking(req, res));

module.exports = router;