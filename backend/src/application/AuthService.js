// backend/src/application/AuthService.js
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

class AuthService {
  constructor(userService, refreshTokenRepository) {
    this.userService = userService;
    this.refreshTokenRepository = refreshTokenRepository;
    this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'access_token_secret';
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh_token_secret';
    this.accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION || '15m';
    this.refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION || '7d';
    
    this.googleClientId = process.env.GOOGLE_CLIENT_ID;
    this.googleClient = new OAuth2Client(this.googleClientId);
  }

  async verifyGoogleToken(token) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.googleClientId,
      });
      return ticket.getPayload();
    } catch (error) {
      console.error('Google token verification failed:', error.message);
      throw new Error('Google authentication failed');
    }
  }

  async googleLogin(payload) {
    const { sub, email, name, picture } = payload;
    
    let user = await this.userService.getUserByEmail(email);
    
    if (!user) {
      // Auto-registration
      user = await this.userService.createUser({
        name: name || email.split('@')[0],
        email: email,
        googleId: sub,
        phone: null,
        password: null, // Optional now in Model
        dateOfBirth: null,
        role: 'user'
      });
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);
    
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        loyaltyPoints: user.loyaltyPoints,
        role: user.role,
        picture: picture // Optional extra info
      },
      accessToken,
      refreshToken
    };
  }

  async generateTokens(user) {
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

    // Save refresh token to database
    if (this.refreshTokenRepository) {
      const expiresAt = this._getExpiryDate(this.refreshTokenExpiration);
      await this.refreshTokenRepository.create({
        userId: user.id,
        token: refreshToken,
        expiresAt: expiresAt
      });
    }

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
      if (error.name === 'TokenExpiredError') {
          throw new Error('Refresh token expired');
      }
      throw new Error('Invalid refresh token');
    }
  }

  async refreshTokens(refreshToken) {
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, this.refreshTokenSecret);
    } catch (error) {
        // If JWT is invalid or expired, we can't do much about reuse detection
        // but we should still delete it if it's in DB (though TTL might handle it)
        if (this.refreshTokenRepository) {
            await this.refreshTokenRepository.deleteByToken(refreshToken);
        }
        throw new Error('Invalid refresh token');
    }

    if (!this.refreshTokenRepository) {
        throw new Error('Refresh token repository not configured');
    }

    // Reuse detection: Check if token exists in database
    const tokenInDb = await this.refreshTokenRepository.findByToken(refreshToken);
    if (!tokenInDb) {
      // REUSE DETECTED!
      // This token was already used or invalidated. 
      // For security, invalidate ALL tokens for this user.
      await this.refreshTokenRepository.deleteAllForUser(decoded.id);
      throw new Error('Invalid refresh token');
    }

    // Token is valid and exists in DB -> Rotate it
    const user = await this.userService.getUserById(decoded.id);
    if (!user) {
      await this.refreshTokenRepository.deleteByToken(refreshToken);
      throw new Error('User not found');
    }

    // Delete old token
    await this.refreshTokenRepository.deleteByToken(refreshToken);

    // Generate and save new pair
    return await this.generateTokens(user);
  }

  async authenticateUser(email, password) {
    const user = await this.userService.authenticateUser(email, password);
    if (user) {
      const { accessToken, refreshToken } = await this.generateTokens(user);
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

  async logout(refreshToken) {
    if (this.refreshTokenRepository) {
      await this.refreshTokenRepository.deleteByToken(refreshToken);
    }
  }

  _getExpiryDate(expirationString) {
    const match = expirationString.match(/^(\d+)([smhd])$/);
    if (!match) {
      // Default to 7 days if parsing fails
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const value = parseInt(match[1]);
    const unit = match[2];
    const now = Date.now();

    switch (unit) {
      case 's': return new Date(now + value * 1000);
      case 'm': return new Date(now + value * 60 * 1000);
      case 'h': return new Date(now + value * 60 * 60 * 1000);
      case 'd': return new Date(now + value * 24 * 60 * 60 * 1000);
      default: return new Date(now + 7 * 24 * 60 * 60 * 1000);
    }
  }
}

module.exports = AuthService;
