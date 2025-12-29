const MongoRefreshTokenRepository = require('../infrastructure/repositories/MongoRefreshTokenRepository');
const RefreshTokenModel = require('../infrastructure/RefreshTokenModel');

jest.mock('../infrastructure/RefreshTokenModel');

describe('MongoRefreshTokenRepository', () => {
  let repository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new MongoRefreshTokenRepository();
  });

  describe('create', () => {
    it('should save a new refresh token', async () => {
      const tokenData = {
        userId: 'user123',
        token: 'token123',
        expiresAt: new Date()
      };
      
      const mockSavedToken = {
        _id: 'rt123',
        ...tokenData,
        toObject: () => ({ _id: 'rt123', ...tokenData })
      };

      RefreshTokenModel.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockSavedToken)
      }));

      const result = await repository.create(tokenData);

      expect(result.id).toBe('rt123');
      expect(result.token).toBe('token123');
      expect(RefreshTokenModel).toHaveBeenCalledWith(expect.objectContaining(tokenData));
    });
  });

  describe('findByToken', () => {
    it('should find a token by token string', async () => {
      const mockToken = {
        _id: 'rt123',
        userId: 'user123',
        token: 'token123',
        expiresAt: new Date()
      };

      RefreshTokenModel.findOne.mockResolvedValue(mockToken);

      const result = await repository.findByToken('token123');

      expect(result.id).toBe('rt123');
      expect(result.token).toBe('token123');
      expect(RefreshTokenModel.findOne).toHaveBeenCalledWith({ token: 'token123' });
    });

    it('should return null if token not found', async () => {
      RefreshTokenModel.findOne.mockResolvedValue(null);
      const result = await repository.findByToken('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('deleteByToken', () => {
    it('should delete a token by token string', async () => {
      RefreshTokenModel.findOneAndDelete.mockResolvedValue({ _id: 'rt123' });
      const result = await repository.deleteByToken('token123');
      expect(result).toBe(true);
      expect(RefreshTokenModel.findOneAndDelete).toHaveBeenCalledWith({ token: 'token123' });
    });
  });

  describe('deleteAllForUser', () => {
    it('should delete all tokens for a user', async () => {
      RefreshTokenModel.deleteMany.mockResolvedValue({ deletedCount: 5 });
      const result = await repository.deleteAllForUser('user123');
      expect(result).toBe(5);
      expect(RefreshTokenModel.deleteMany).toHaveBeenCalledWith({ userId: 'user123' });
    });
  });
});
