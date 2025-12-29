const mongoose = require('mongoose');
const RefreshTokenModel = require('../infrastructure/RefreshTokenModel');

describe('RefreshToken Model Validation', () => {
  it('should create a valid refresh token', () => {
    const refreshToken = new RefreshTokenModel({
      userId: new mongoose.Types.ObjectId(),
      token: 'some-random-token',
      expiresAt: new Date(Date.now() + 86400000) // tomorrow
    });
    const err = refreshToken.validateSync();
    expect(err).toBeUndefined();
  });

  it('should require userId, token, and expiresAt', () => {
    const refreshToken = new RefreshTokenModel({});
    const err = refreshToken.validateSync();
    expect(err).toBeDefined();
    expect(err.errors['userId']).toBeDefined();
    expect(err.errors['token']).toBeDefined();
    expect(err.errors['expiresAt']).toBeDefined();
  });
});
