// backend/src/interfaces/http/middleware/auth.js
const jwt = require('jsonwebtoken');
const MongoUserRepository = require('../../../infrastructure/repositories/MongoUserRepository');
const UserService = require('../../../application/UserService');
const AuthService = require('../../../application/AuthService');

const userRepository = new MongoUserRepository();
const userService = new UserService(userRepository);
const authService = new AuthService(userService);

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = authService.verifyAccessToken(token);
    
    // Fetch user from database to ensure they still exist
    const user = await userService.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

module.exports = { authenticate, authorizeAdmin };