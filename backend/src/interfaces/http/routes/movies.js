const express = require('express');
const MovieController = require('../controllers/MovieController');
const MongoMovieRepository = require('../../../infrastructure/repositories/MongoMovieRepository');
const MovieService = require('../../../application/MovieService');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Initialize service and controller
const movieRepository = new MongoMovieRepository();
const movieService = new MovieService(movieRepository);
const movieController = new MovieController(movieService);

const router = express.Router();

// Public routes
router.get('/', (req, res) => movieController.getAllMovies(req, res));
router.get('/now-showing', (req, res) => movieController.getNowShowing(req, res));
router.get('/coming-soon', (req, res) => movieController.getComingSoon(req, res));
router.get('/:id', (req, res) => movieController.getMovieById(req, res));

// Protected routes (admin only)
router.post('/', authenticate, authorizeAdmin, (req, res) => movieController.createMovie(req, res));
router.put('/:id', authenticate, authorizeAdmin, (req, res) => movieController.updateMovie(req, res));
router.delete('/:id', authenticate, authorizeAdmin, (req, res) => movieController.deleteMovie(req, res));

module.exports = router;