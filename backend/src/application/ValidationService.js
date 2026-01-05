const jwt = require('jsonwebtoken');

class ValidationService {
  constructor(secret) {
    this.secret = secret || process.env.VALIDATION_TOKEN_SECRET || 'validation_secret';
    this.expiration = '90d'; // Long-lived, validation logic handles the specific window
  }

  generateValidationToken(bookingId) {
    return jwt.sign({ bookingId }, this.secret, { expiresIn: this.expiration });
  }

  verifyValidationToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Validation token expired');
      }
      throw new Error('Invalid validation token');
    }
  }
}

module.exports = ValidationService;
