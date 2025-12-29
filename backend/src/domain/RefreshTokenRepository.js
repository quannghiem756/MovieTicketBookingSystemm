/* eslint-disable no-unused-vars */
class RefreshTokenRepository {
  async create(tokenData) {
    throw new Error('Method not implemented');
  }

  async findByToken(token) {
    throw new Error('Method not implemented');
  }

  async deleteByToken(token) {
    throw new Error('Method not implemented');
  }

  async deleteAllForUser(userId) {
    throw new Error('Method not implemented');
  }
}

module.exports = RefreshTokenRepository;
