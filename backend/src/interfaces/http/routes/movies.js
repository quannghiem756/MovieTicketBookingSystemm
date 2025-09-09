const express = require('express');
const MovieController = require('../controllers/MovieController');
const MongoMovieRepository = require('../../../infrastructure/repositories/MongoMovieRepository');
const MovieService = require('../../../application/MovieService');

// Initialize service and controller
const movieRepository = new MongoMovieRepository();
const movieService = new MovieService(movieRepository);
const movieController = new MovieController(movieService);

const router = express.Router();

// Movie routes
router.post('/', (req, res) => movieController.createMovie(req, res));
router.get('/', (req, res) => movieController.getAllMovies(req, res));
router.get('/now-showing', (req, res) => movieController.getNowShowing(req, res));
router.get('/coming-soon', (req, res) => movieController.getComingSoon(req, res));
router.get('/:id', (req, res) => movieController.getMovieById(req, res));
router.put('/:id', (req, res) => movieController.updateMovie(req, res));
router.delete('/:id', (req, res) => movieController.deleteMovie(req, res));

module.exports = router;