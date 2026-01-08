const express = require('express');
const UserController = require('../controllers/UserController');
const MongoUserRepository = require('../../../infrastructure/repositories/MongoUserRepository');
const MongoRefreshTokenRepository = require('../../../infrastructure/repositories/MongoRefreshTokenRepository');
const UserService = require('../../../application/UserService');
const AuthService = require('../../../application/AuthService');
const OTPService = require('../../../application/OTPService');
const EmailService = require('../../../infrastructure/EmailService');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { registerValidationRules, loginValidationRules, validate } = require('../middleware/validation');

// Initialize services and controller
const userRepository = new MongoUserRepository();
const refreshTokenRepository = new MongoRefreshTokenRepository();
const userService = new UserService(userRepository);
const authService = new AuthService(userService, refreshTokenRepository);
const userController = new UserController(userService, authService, OTPService, EmailService);

const router = express.Router();

// Public routes
router.post('/', registerValidationRules(), validate, (req, res) => userController.createUser(req, res));
router.post('/login', loginValidationRules(), validate, (req, res) => userController.authenticateUser(req, res));
router.post('/google-login', (req, res) => userController.googleLogin(req, res));
router.post('/refresh-token', (req, res) => userController.refreshToken(req, res));
router.post('/logout', (req, res) => userController.logout(req, res));
router.post('/verify-registration', (req, res) => userController.verifyRegistration(req, res));
router.post('/resend-verification-otp', (req, res) => userController.resendVerificationOTP(req, res));
router.post('/forgot-password', (req, res) => userController.forgotPassword(req, res));
router.post('/reset-password', (req, res) => userController.resetPassword(req, res));

// Protected routes
router.get('/', authenticate, authorizeAdmin, (req, res) => userController.getAllUsers(req, res));
router.post('/admin', authenticate, authorizeAdmin, (req, res) => userController.createUserByAdmin(req, res)); // Admin creation route
router.get('/:id', authenticate, (req, res) => userController.getUserById(req, res));
router.get('/email/:email', authenticate, (req, res) => userController.getUserByEmail(req, res));
router.put('/:id', authenticate, (req, res) => userController.updateUser(req, res));

// Admin only routes
router.delete('/:id', authenticate, authorizeAdmin, (req, res) => userController.deleteUser(req, res));

module.exports = router;
