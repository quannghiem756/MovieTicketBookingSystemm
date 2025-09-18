const express = require('express');
const TheaterController = require('../controllers/TheaterController');
const MongoTheaterRepository = require('../../../infrastructure/repositories/MongoTheaterRepository');
const TheaterService = require('../../../application/TheaterService');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Initialize service and controller
const theaterRepository = new MongoTheaterRepository();
const theaterService = new TheaterService(theaterRepository);
const theaterController = new TheaterController(theaterService);

const router = express.Router();

// Public routes
router.get('/', (req, res) => theaterController.getAllTheaters(req, res));
router.get('/:id', (req, res) => theaterController.getTheaterById(req, res));

// Protected routes (admin only)
router.post('/', authenticate, authorizeAdmin, (req, res) => theaterController.createTheater(req, res));
router.put('/:id', authenticate, authorizeAdmin, (req, res) => theaterController.updateTheater(req, res));
router.delete('/:id', authenticate, authorizeAdmin, (req, res) => theaterController.deleteTheater(req, res));

module.exports = router;