const jwt = require('jsonwebtoken');

class ValidationService {
  constructor(secret) {
    this.secret = secret || process.env.VALIDATION_TOKEN_SECRET || 'validation_secret';
    this.expiration = '1h'; // Short-lived as per spec recommendation
  }

  generateValidationToken(bookingId) {
    return jwt.sign({ bookingId }, this.secret, { expiresIn: this.expiration });
  }

  verifyValidationToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid validation token');
    }
  }
}

module.exports = ValidationService;
