const express = require('express');
const DashboardController = require('../controllers/DashboardController');
const MongoMovieRepository = require('../../../infrastructure/repositories/MongoMovieRepository');
const MongoShowtimeRepository = require('../../../infrastructure/repositories/MongoShowtimeRepository');
const MongoBookingRepository = require('../../../infrastructure/repositories/MongoBookingRepository');
const MongoUserRepository = require('../../../infrastructure/repositories/MongoUserRepository');
const DashboardService = require('../../../application/DashboardService');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Initialize service and controller
const movieRepository = new MongoMovieRepository();
const showtimeRepository = new MongoShowtimeRepository();
const bookingRepository = new MongoBookingRepository();
const userRepository = new MongoUserRepository();
const dashboardService = new DashboardService(movieRepository, showtimeRepository, bookingRepository, userRepository);
const dashboardController = new DashboardController(dashboardService);

const router = express.Router();

// Protected route (admin only)
router.get('/stats', authenticate, authorizeAdmin, (req, res) => dashboardController.getStats(req, res));
router.get('/recent-activity', authenticate, authorizeAdmin, (req, res) => dashboardController.getRecentActivity(req, res));
router.get('/performance-stats', authenticate, authorizeAdmin, (req, res) => dashboardController.getPerformanceStats(req, res));

module.exports = router;