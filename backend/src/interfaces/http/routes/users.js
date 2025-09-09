const express = require('express');
const UserController = require('../controllers/UserController');
const MongoUserRepository = require('../../../infrastructure/repositories/MongoUserRepository');
const UserService = require('../../../application/UserService');

// Initialize service and controller
const userRepository = new MongoUserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = express.Router();

// User routes
router.post('/', (req, res) => userController.createUser(req, res));
router.post('/login', (req, res) => userController.authenticateUser(req, res));
router.get('/:id', (req, res) => userController.getUserById(req, res));
router.get('/email/:email', (req, res) => userController.getUserByEmail(req, res));
router.put('/:id', (req, res) => userController.updateUser(req, res));
router.delete('/:id', (req, res) => userController.deleteUser(req, res));

module.exports = router;