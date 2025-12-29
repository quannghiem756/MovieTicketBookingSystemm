const RefreshTokenRepository = require('../../domain/RefreshTokenRepository');
const RefreshTokenModel = require('../RefreshTokenModel');

class MongoRefreshTokenRepository extends RefreshTokenRepository {
  async create(tokenData) {
    const refreshTokenDoc = new RefreshTokenModel({
      userId: tokenData.userId,
      token: tokenData.token,
      expiresAt: tokenData.expiresAt
    });

    const savedToken = await refreshTokenDoc.save();
    return this._mapToDomain(savedToken);
  }

  async findByToken(token) {
    const tokenDoc = await RefreshTokenModel.findOne({ token });
    if (!tokenDoc) return null;
    return this._mapToDomain(tokenDoc);
  }

  async deleteByToken(token) {
    const result = await RefreshTokenModel.findOneAndDelete({ token });
    return result !== null;
  }

  async deleteAllForUser(userId) {
    const result = await RefreshTokenModel.deleteMany({ userId });
    return result.deletedCount;
  }

  _mapToDomain(doc) {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      token: doc.token,
      expiresAt: doc.expiresAt,
      createdAt: doc.createdAt
    };
  }
}

module.exports = MongoRefreshTokenRepository;
