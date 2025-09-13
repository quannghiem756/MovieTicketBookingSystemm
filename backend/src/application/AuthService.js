// backend/src/application/AuthService.js
const jwt = require('jsonwebtoken');
const UserService = require('./UserService');

class AuthService {
  constructor(userService) {
    this.userService = userService;
    this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'access_token_secret';
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh_token_secret';
    this.accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION || '15m';
    this.refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION || '7d';
  }

  generateTokens(user) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name
    };

    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiration
    });

    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiration
    });

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessTokenSecret);
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshTokenSecret);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async refreshTokens(refreshToken) {
    try {
      const decoded = this.verifyRefreshToken(refreshToken);
      const user = await this.userService.getUserById(decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }

      const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(user);
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }

  async authenticateUser(email, password) {
    const user = await this.userService.authenticateUser(email, password);
    if (user) {
      const { accessToken, refreshToken } = this.generateTokens(user);
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          loyaltyPoints: user.loyaltyPoints,
          role: user.role
        },
        accessToken,
        refreshToken
      };
    }
    return null;
  }
}

module.exports = AuthService;