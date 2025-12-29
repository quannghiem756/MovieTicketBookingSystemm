const AuthService = require('../application/AuthService');
const jwt = require('jsonwebtoken');

describe('AuthService', () => {
  let authService;
  let mockUserService;
  let mockRefreshTokenRepository;

  beforeEach(() => {
    mockUserService = {
      getUserById: jest.fn(),
      authenticateUser: jest.fn()
    };
    mockRefreshTokenRepository = {
      create: jest.fn(),
      findByToken: jest.fn(),
      deleteByToken: jest.fn(),
      deleteAllForUser: jest.fn()
    };
    authService = new AuthService(mockUserService, mockRefreshTokenRepository);
  });

  describe('authenticateUser', () => {
    it('should authenticate user and store refresh token', async () => {
      const mockUser = { id: 'u123', email: 'test@test.com', name: 'Test' };
      mockUserService.authenticateUser.mockResolvedValue(mockUser);
      mockRefreshTokenRepository.create.mockResolvedValue({});

      const result = await authService.authenticateUser('test@test.com', 'password');

      expect(result.user.id).toBe('u123');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(mockRefreshTokenRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        userId: 'u123',
        token: expect.any(String),
        expiresAt: expect.any(Date)
      }));
    });

    it('should generate tokens without repository', async () => {
        const serviceNoRepo = new AuthService(mockUserService);
        const mockUser = { id: 'u123', email: 'test@test.com', name: 'Test' };
        mockUserService.authenticateUser.mockResolvedValue(mockUser);
        
        const result = await serviceNoRepo.authenticateUser('test@test.com', 'password');
        expect(result.accessToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
    });
  });

  describe('refreshTokens', () => {
    it('should rotate tokens if refresh token is valid and exists in DB', async () => {
      const mockUser = { id: 'u123', email: 'test@test.com' };
      const oldToken = jwt.sign({ id: 'u123' }, authService.refreshTokenSecret);
      
      mockRefreshTokenRepository.findByToken.mockResolvedValue({ 
        userId: 'u123', 
        token: oldToken,
        expiresAt: new Date(Date.now() + 10000)
      });
      mockUserService.getUserById.mockResolvedValue(mockUser);
      mockRefreshTokenRepository.create.mockResolvedValue({});

      const result = await authService.refreshTokens(oldToken);

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(mockRefreshTokenRepository.deleteByToken).toHaveBeenCalledWith(oldToken);
      expect(mockRefreshTokenRepository.create).toHaveBeenCalled();
    });

    it('should throw error and detect reuse if token is valid but NOT in DB', async () => {
      const oldToken = jwt.sign({ id: 'u123' }, authService.refreshTokenSecret);
      mockRefreshTokenRepository.findByToken.mockResolvedValue(null);

      await expect(authService.refreshTokens(oldToken)).rejects.toThrow('Invalid refresh token');
      expect(mockRefreshTokenRepository.deleteAllForUser).toHaveBeenCalledWith('u123');
    });

    it('should throw error if JWT is invalid', async () => {
        await expect(authService.refreshTokens('invalid')).rejects.toThrow('Invalid refresh token');
        expect(mockRefreshTokenRepository.deleteByToken).toHaveBeenCalledWith('invalid');
    });

    it('should throw error if user not found', async () => {
        const oldToken = jwt.sign({ id: 'u123' }, authService.refreshTokenSecret);
        mockRefreshTokenRepository.findByToken.mockResolvedValue({ userId: 'u123', token: oldToken });
        mockUserService.getUserById.mockResolvedValue(null);

        await expect(authService.refreshTokens(oldToken)).rejects.toThrow('User not found');
        expect(mockRefreshTokenRepository.deleteByToken).toHaveBeenCalledWith(oldToken);
    });

    it('should throw error if repository not provided', async () => {
        const oldToken = jwt.sign({ id: 'u123' }, authService.refreshTokenSecret);
        const serviceNoRepo = new AuthService(mockUserService);
        await expect(serviceNoRepo.refreshTokens(oldToken)).rejects.toThrow('Refresh token repository not configured');
    });
    it('should return null if user authentication fails', async () => {
        mockUserService.authenticateUser.mockResolvedValue(null);
        const result = await authService.authenticateUser('fail@test.com', 'wrong');
        expect(result).toBeNull();
    });
  });

  describe('logout', () => {
    it('should delete the specific refresh token', async () => {
      await authService.logout('some-token');
      expect(mockRefreshTokenRepository.deleteByToken).toHaveBeenCalledWith('some-token');
    });

    it('should do nothing on logout if repo not configured', async () => {
        const serviceNoRepo = new AuthService(mockUserService);
        await expect(serviceNoRepo.logout('token')).resolves.not.toThrow();
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', () => {
      const token = jwt.sign({ id: 'u1' }, authService.accessTokenSecret);
      const decoded = authService.verifyAccessToken(token);
      expect(decoded.id).toBe('u1');
    });

    it('should throw error for invalid access token', () => {
      expect(() => authService.verifyAccessToken('invalid')).toThrow('Invalid access token');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const token = jwt.sign({ id: 'u1' }, authService.refreshTokenSecret);
      const decoded = authService.verifyRefreshToken(token);
      expect(decoded.id).toBe('u1');
    });

    it('should throw error for invalid refresh token', () => {
      expect(() => authService.verifyRefreshToken('invalid')).toThrow('Invalid refresh token');
    });

    it('should throw error for expired refresh token', (done) => {
      const token = jwt.sign({ id: 'u1' }, authService.refreshTokenSecret, { expiresIn: '0s' });
      // Small delay to ensure it expires
      setTimeout(() => {
        expect(() => authService.verifyRefreshToken(token)).toThrow('Refresh token expired');
        done();
      }, 10);
    });
  });

  describe('_getExpiryDate', () => {
    it('should parse various duration formats', () => {
      const now = Date.now();
      
      const s = authService._getExpiryDate('10s');
      expect(s.getTime()).toBeGreaterThanOrEqual(now + 10000);
      
      const m = authService._getExpiryDate('5m');
      expect(m.getTime()).toBeGreaterThanOrEqual(now + 5 * 60 * 1000);
      
      const h = authService._getExpiryDate('2h');
      expect(h.getTime()).toBeGreaterThanOrEqual(now + 2 * 60 * 60 * 1000);
      
      const d = authService._getExpiryDate('1d');
      expect(d.getTime()).toBeGreaterThanOrEqual(now + 24 * 60 * 60 * 1000);
    });

    it('should default to 7 days for invalid format', () => {
        const now = Date.now();
        const date = authService._getExpiryDate('invalid');
        expect(date.getTime()).toBeGreaterThanOrEqual(now + 7 * 24 * 60 * 60 * 1000);
    });
  });

  describe('verifyGoogleToken', () => {
    it('should verify a valid Google token', async () => {
      // We'll need to mock OAuth2Client. Since it's from a library,
      // we might need to mock the whole library in this test file or use a specific mock.
      // For now, let's assume we can mock the client instance.
      authService.googleClient = {
        verifyIdToken: jest.fn().mockResolvedValue({
          getPayload: () => ({
            sub: 'google-uid-123',
            email: 'google@test.com',
            name: 'Google User',
            picture: 'http://photo.com'
          })
        })
      };

      const payload = await authService.verifyGoogleToken('valid-google-token');
      expect(payload.sub).toBe('google-uid-123');
      expect(payload.email).toBe('google@test.com');
    });

    it('should throw error for invalid Google token', async () => {
      authService.googleClient = {
        verifyIdToken: jest.fn().mockRejectedValue(new Error('Invalid Google token'))
      };

      await expect(authService.verifyGoogleToken('invalid')).rejects.toThrow('Google authentication failed');
    });
  });
});
