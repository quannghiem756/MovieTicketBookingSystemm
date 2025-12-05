const express = require('express');
const RecommendationController = require('../../../interfaces/http/controllers/RecommendationController');
const MovieService = require('../../../application/MovieService');
const MongoMovieRepository = require('../../../infrastructure/repositories/MongoMovieRepository');

const router = express.Router();

// Initialize repository and service
const movieRepository = new MongoMovieRepository();
const movieService = new MovieService(movieRepository);
const recommendationController = new RecommendationController(movieService);

// Get movie recommendations
router.post('/', (req, res) => recommendationController.getMovieRecommendations(req, res));

// Get available movies
router.post('/available', (req, res) => recommendationController.getAvailableMovies(req, res));

module.exports = router;