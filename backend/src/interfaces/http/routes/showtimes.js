const express = require('express');
const ShowtimeController = require('../controllers/ShowtimeController');
const MongoShowtimeRepository = require('../../../infrastructure/repositories/MongoShowtimeRepository');
const ShowtimeService = require('../../../application/ShowtimeService');

// Initialize service and controller
const showtimeRepository = new MongoShowtimeRepository();
const showtimeService = new ShowtimeService(showtimeRepository);
const showtimeController = new ShowtimeController(showtimeService);

const router = express.Router();

// Showtime routes
router.post('/', (req, res) => showtimeController.createShowtime(req, res));
router.get('/:id', (req, res) => showtimeController.getShowtimeById(req, res));
router.get('/movie/:movieId', (req, res) => showtimeController.getShowtimesByMovieId(req, res));
router.put('/:id', (req, res) => showtimeController.updateShowtime(req, res));
router.delete('/:id', (req, res) => showtimeController.deleteShowtime(req, res));

module.exports = router;