const express = require('express');
const BookingController = require('../controllers/BookingController');
const MongoBookingRepository = require('../../../infrastructure/repositories/MongoBookingRepository');
const MongoUserRepository = require('../../../infrastructure/repositories/MongoUserRepository');
const MongoShowtimeRepository = require('../../../infrastructure/repositories/MongoShowtimeRepository');
const MongoMovieRepository = require('../../../infrastructure/repositories/MongoMovieRepository');
const MongoTheaterRepository = require('../../../infrastructure/repositories/MongoTheaterRepository');
const BookingService = require('../../../application/BookingService');
const CouponService = require('../../../application/CouponService');
const ValidationService = require('../../../application/ValidationService');
const EmailService = require('../../../infrastructure/EmailService');
const MongoCouponRepository = require('../../../infrastructure/repositories/MongoCouponRepository');
const MongoAuditLogRepository = require('../../../infrastructure/repositories/MongoAuditLogRepository');
const { authenticate, authorizeAdmin, authorizeStaff } = require('../middleware/auth');
const { seatHoldLimiter } = require('../middleware/rateLimiter');

// Initialize service and controller
const bookingRepository = new MongoBookingRepository();
const userRepository = new MongoUserRepository();
const showtimeRepository = new MongoShowtimeRepository();
const movieRepository = new MongoMovieRepository();
const theaterRepository = new MongoTheaterRepository();
const couponRepository = new MongoCouponRepository();
const auditLogRepository = new MongoAuditLogRepository();
const couponService = new CouponService(couponRepository, bookingRepository);
const validationService = new ValidationService();
const bookingService = new BookingService(
  bookingRepository, 
  userRepository, 
  showtimeRepository, 
  movieRepository, 
  couponService, 
  validationService,
  EmailService,
  theaterRepository,
  auditLogRepository
);
const bookingController = new BookingController(bookingService);

const router = express.Router();

// Protected routes
router.get('/validate', (req, res) => bookingController.validateBooking(req, res));
router.get('/search', authenticate, authorizeStaff, (req, res) => bookingController.searchBookings(req, res));
router.get('/', authenticate, authorizeAdmin, (req, res) => bookingController.getAllBookings(req, res));
router.post('/', authenticate, (req, res) => bookingController.createBooking(req, res));
router.get('/:id', authenticate, (req, res) => bookingController.getBookingById(req, res));
router.get('/user/:userId', authenticate, (req, res) => bookingController.getBookingsByUserId(req, res));
router.put('/:id/confirm', authenticate, authorizeAdmin, (req, res) => bookingController.confirmBooking(req, res));
router.put('/:id/cancel', authenticate, (req, res) => bookingController.cancelBooking(req, res));
router.patch('/:id/manual-redeem', authenticate, authorizeStaff, (req, res) => bookingController.manualRedeem(req, res));

// Seat holding routes
router.post('/hold', authenticate, seatHoldLimiter, (req, res) => bookingController.holdSeat(req, res));
router.post('/release', authenticate, (req, res) => bookingController.releaseSeat(req, res));
router.post('/release-all', authenticate, (req, res) => bookingController.releaseAllSeats(req, res));
router.get('/locked-seats/:showtimeId', (req, res) => bookingController.getLockedSeats(req, res));

module.exports = router;