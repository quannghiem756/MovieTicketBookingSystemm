const express = require('express');
const UserController = require('../controllers/UserController');
const MongoUserRepository = require('../../../infrastructure/repositories/MongoUserRepository');
const UserService = require('../../../application/UserService');
const AuthService = require('../../../application/AuthService');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { registerValidationRules, loginValidationRules, validate } = require('../middleware/validation');

// Initialize services and controller
const userRepository = new MongoUserRepository();
const userService = new UserService(userRepository);
const authService = new AuthService(userService);
const userController = new UserController(userService, authService);

const router = express.Router();

// Public routes
router.post('/', registerValidationRules(), validate, (req, res) => userController.createUser(req, res));
router.post('/login', loginValidationRules(), validate, (req, res) => userController.authenticateUser(req, res));
router.post('/refresh-token', (req, res) => userController.refreshToken(req, res));

// Protected routes
router.get('/:id', authenticate, (req, res) => userController.getUserById(req, res));
router.get('/email/:email', authenticate, (req, res) => userController.getUserByEmail(req, res));
router.put('/:id', authenticate, (req, res) => userController.updateUser(req, res));

// Admin only routes
router.delete('/:id', authenticate, authorizeAdmin, (req, res) => userController.deleteUser(req, res));

module.exports = router;