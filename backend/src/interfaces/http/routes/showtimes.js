const express = require('express');
const ShowtimeController = require('../controllers/ShowtimeController');
const MongoShowtimeRepository = require('../../../infrastructure/repositories/MongoShowtimeRepository');
const ShowtimeService = require('../../../application/ShowtimeService');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Initialize service and controller
const showtimeRepository = new MongoShowtimeRepository();
const showtimeService = new ShowtimeService(showtimeRepository);
const showtimeController = new ShowtimeController(showtimeService);

const router = express.Router();

// Public routes
router.get('/', (req, res) => showtimeController.getAllShowtimes(req, res));
router.get('/movie/:movieId', (req, res) => showtimeController.getShowtimesByMovieId(req, res));
router.get('/movie/:movieId/future', (req, res) => showtimeController.getFutureShowtimesByMovieId(req, res));
router.get('/date', (req, res) => showtimeController.getShowtimesByDate(req, res));
router.get('/:id', (req, res) => showtimeController.getShowtimeById(req, res));

// Protected routes (admin only)
router.post('/', authenticate, authorizeAdmin, (req, res) => showtimeController.createShowtime(req, res));
router.put('/:id', authenticate, authorizeAdmin, (req, res) => showtimeController.updateShowtime(req, res));
router.delete('/:id', authenticate, authorizeAdmin, (req, res) => showtimeController.deleteShowtime(req, res));

module.exports = router;